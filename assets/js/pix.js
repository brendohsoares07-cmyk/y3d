"use strict";
// ts/pix.ts — QR Code do Pix no checkout do site PHP (compilado para assets/js/pix.js).
// Cópia da lógica de frontend/src/utils/pix.ts: se mudar lá, mude aqui.
// O PHP calcula o valor do pedido; este arquivo só monta o código Pix e desenha o QR.
(() => {
    /** Dados do recebedor. A chave é a do Pix da Y3D (aqui, um CPF, só dígitos). */
    const PIX_CHAVE = "10792059930";
    const PIX_NOME = "Y3D CREATIONS"; // até 25 caracteres, sem acento
    const PIX_CIDADE = "BRASIL"; // até 15 caracteres, sem acento
    function tlv(id, valor) {
        return id + String(valor.length).padStart(2, "0") + valor;
    }
    /** CRC16/CCITT-FALSE exigido no fim de todo BR Code. */
    function crc16(texto) {
        let crc = 0xffff;
        for (let i = 0; i < texto.length; i++) {
            crc ^= texto.charCodeAt(i) << 8;
            for (let b = 0; b < 8; b++) {
                crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
            }
        }
        return crc.toString(16).toUpperCase().padStart(4, "0");
    }
    function limpar(texto, max) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^A-Za-z0-9 ]/g, "")
            .toUpperCase()
            .slice(0, max)
            .trim();
    }
    /** Monta o código "Pix copia e cola" para o valor informado (em reais). */
    function montarPix(valor, chave = PIX_CHAVE, nome = PIX_NOME, cidade = PIX_CIDADE) {
        const conta = tlv("00", "br.gov.bcb.pix") + tlv("01", chave);
        const corpo = tlv("00", "01") +
            tlv("01", "11") +
            tlv("26", conta) +
            tlv("52", "0000") +
            tlv("53", "986") +
            tlv("54", valor.toFixed(2)) +
            tlv("58", "BR") +
            tlv("59", limpar(nome, 25)) +
            tlv("60", limpar(cidade, 15)) +
            tlv("62", tlv("05", "***")) +
            "6304";
        return corpo + crc16(corpo);
    }
    // ---------------------------------------------------------------------------
    // QR Code (modo byte, correção de erros nível M, versões 1 a 40)
    // ---------------------------------------------------------------------------
    const ECC_POR_BLOCO = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
    const NUM_BLOCOS = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
    function modulosBrutos(ver) {
        let r = (16 * ver + 128) * ver + 64;
        if (ver >= 2) {
            const n = Math.floor(ver / 7) + 2;
            r -= (25 * n - 10) * n - 55;
            if (ver >= 7)
                r -= 36;
        }
        return r;
    }
    function bytesDeDados(ver) {
        return Math.floor(modulosBrutos(ver) / 8) - ECC_POR_BLOCO[ver] * NUM_BLOCOS[ver];
    }
    function multiplicarGF(x, y) {
        let z = 0;
        for (let i = 7; i >= 0; i--) {
            z = (z << 1) ^ ((z >>> 7) * 0x11d);
            z ^= ((y >>> i) & 1) * x;
        }
        return z;
    }
    function divisorRS(grau) {
        const r = new Array(grau).fill(0);
        r[grau - 1] = 1;
        let raiz = 1;
        for (let i = 0; i < grau; i++) {
            for (let j = 0; j < grau; j++) {
                r[j] = multiplicarGF(r[j], raiz);
                if (j + 1 < grau)
                    r[j] ^= r[j + 1];
            }
            raiz = multiplicarGF(raiz, 2);
        }
        return r;
    }
    function restoRS(dados, divisor) {
        const r = new Array(divisor.length).fill(0);
        for (const b of dados) {
            const fator = b ^ r.shift();
            r.push(0);
            divisor.forEach((coef, i) => {
                r[i] ^= multiplicarGF(coef, fator);
            });
        }
        return r;
    }
    function utf8(texto) {
        return Array.from(new TextEncoder().encode(texto));
    }
    function adicionarBits(bits, valor, tamanho) {
        for (let i = tamanho - 1; i >= 0; i--)
            bits.push((valor >>> i) & 1);
    }
    function codewords(bytes, ver) {
        const bits = [];
        adicionarBits(bits, 0x4, 4); // modo byte
        adicionarBits(bits, bytes.length, ver <= 9 ? 8 : 16);
        bytes.forEach((b) => adicionarBits(bits, b, 8));
        const capacidade = bytesDeDados(ver) * 8;
        adicionarBits(bits, 0, Math.min(4, capacidade - bits.length));
        adicionarBits(bits, 0, (8 - (bits.length % 8)) % 8);
        for (let pad = 0xec; bits.length < capacidade; pad ^= 0xec ^ 0x11)
            adicionarBits(bits, pad, 8);
        const dados = new Array(bits.length / 8).fill(0);
        bits.forEach((b, i) => {
            dados[i >>> 3] |= b << (7 - (i & 7));
        });
        const nBlocos = NUM_BLOCOS[ver];
        const eccLen = ECC_POR_BLOCO[ver];
        const brutos = Math.floor(modulosBrutos(ver) / 8);
        const nCurtos = nBlocos - (brutos % nBlocos);
        const lenCurto = Math.floor(brutos / nBlocos);
        const divisor = divisorRS(eccLen);
        const blocos = [];
        for (let i = 0, k = 0; i < nBlocos; i++) {
            const dat = dados.slice(k, k + lenCurto - eccLen + (i < nCurtos ? 0 : 1));
            k += dat.length;
            const ecc = restoRS(dat, divisor);
            if (i < nCurtos)
                dat.push(0);
            blocos.push(dat.concat(ecc));
        }
        const saida = [];
        for (let i = 0; i < blocos[0].length; i++) {
            blocos.forEach((bloco, j) => {
                if (i !== lenCurto - eccLen || j >= nCurtos)
                    saida.push(bloco[i]);
            });
        }
        return saida;
    }
    function posicoesAlinhamento(ver) {
        if (ver === 1)
            return [];
        const n = Math.floor(ver / 7) + 2;
        const passo = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
        const r = [6];
        for (let pos = ver * 4 + 10; r.length < n; pos -= passo)
            r.splice(1, 0, pos);
        return r;
    }
    function desenharFormato(m, fn, tam, mascara) {
        const set = (x, y, v) => {
            m[y][x] = v;
            fn[y][x] = true;
        };
        const dado = mascara; // nível M = 0b00
        let resto = dado;
        for (let i = 0; i < 10; i++)
            resto = (resto << 1) ^ ((resto >>> 9) * 0x537);
        const bits = ((dado << 10) | resto) ^ 0x5412;
        const bit = (i) => ((bits >>> i) & 1) !== 0;
        for (let i = 0; i <= 5; i++)
            set(8, i, bit(i));
        set(8, 7, bit(6));
        set(8, 8, bit(7));
        set(7, 8, bit(8));
        for (let i = 9; i < 15; i++)
            set(14 - i, 8, bit(i));
        for (let i = 0; i < 8; i++)
            set(tam - 1 - i, 8, bit(i));
        for (let i = 8; i < 15; i++)
            set(8, tam - 15 + i, bit(i));
        set(8, tam - 8, true);
    }
    function aplicarMascara(m, fn, tam, mascara) {
        for (let y = 0; y < tam; y++) {
            for (let x = 0; x < tam; x++) {
                let inverter = false;
                switch (mascara) {
                    case 0:
                        inverter = (x + y) % 2 === 0;
                        break;
                    case 1:
                        inverter = y % 2 === 0;
                        break;
                    case 2:
                        inverter = x % 3 === 0;
                        break;
                    case 3:
                        inverter = (x + y) % 3 === 0;
                        break;
                    case 4:
                        inverter = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
                        break;
                    case 5:
                        inverter = ((x * y) % 2) + ((x * y) % 3) === 0;
                        break;
                    case 6:
                        inverter = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
                        break;
                    default: inverter = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
                }
                if (!fn[y][x] && inverter)
                    m[y][x] = !m[y][x];
            }
        }
    }
    function penalidade(m, tam) {
        var _a, _b;
        let total = 0;
        const linhas = [];
        for (let y = 0; y < tam; y++)
            linhas.push(m[y].map((v) => (v ? "1" : "0")).join(""));
        const colunas = [];
        for (let x = 0; x < tam; x++)
            colunas.push(m.map((l) => (l[x] ? "1" : "0")).join(""));
        for (const seq of linhas.concat(colunas)) {
            const corridas = (_a = seq.match(/0+|1+/g)) !== null && _a !== void 0 ? _a : [];
            corridas.forEach((c) => {
                if (c.length >= 5)
                    total += 3 + (c.length - 5);
            });
            total += 40 * (((_b = seq.match(/(?=10111010000|00001011101)/g)) !== null && _b !== void 0 ? _b : []).length);
        }
        for (let y = 0; y < tam - 1; y++) {
            for (let x = 0; x < tam - 1; x++) {
                if (m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1])
                    total += 3;
            }
        }
        const escuros = m.reduce((s, l) => s + l.filter(Boolean).length, 0);
        const k = Math.ceil(Math.abs(escuros * 20 - tam * tam * 10) / (tam * tam)) - 1;
        return total + Math.max(0, k) * 10;
    }
    /** Gera a matriz do QR Code (true = módulo escuro) para o texto informado. */
    function gerarQr(texto) {
        const bytes = utf8(texto);
        let ver = 1;
        while (ver <= 40 && bytesDeDados(ver) * 8 < 4 + (ver <= 9 ? 8 : 16) + bytes.length * 8)
            ver++;
        if (ver > 40)
            throw new Error("Texto grande demais para o QR Code");
        const tam = ver * 4 + 17;
        const base = Array.from({ length: tam }, () => new Array(tam).fill(false));
        const fn = Array.from({ length: tam }, () => new Array(tam).fill(false));
        const set = (x, y, v) => {
            if (x >= 0 && x < tam && y >= 0 && y < tam) {
                base[y][x] = v;
                fn[y][x] = true;
            }
        };
        for (let i = 0; i < tam; i++) {
            set(6, i, i % 2 === 0);
            set(i, 6, i % 2 === 0);
        }
        for (const [cx, cy] of [[3, 3], [tam - 4, 3], [3, tam - 4]]) {
            for (let dy = -4; dy <= 4; dy++) {
                for (let dx = -4; dx <= 4; dx++) {
                    const d = Math.max(Math.abs(dx), Math.abs(dy));
                    set(cx + dx, cy + dy, d !== 2 && d !== 4);
                }
            }
        }
        const alin = posicoesAlinhamento(ver);
        alin.forEach((ax, i) => {
            alin.forEach((ay, j) => {
                if ((i === 0 && j === 0) || (i === 0 && j === alin.length - 1) || (i === alin.length - 1 && j === 0))
                    return;
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++)
                        set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
                }
            });
        });
        desenharFormato(base, fn, tam, 0);
        if (ver >= 7) {
            let resto = ver;
            for (let i = 0; i < 12; i++)
                resto = (resto << 1) ^ ((resto >>> 11) * 0x1f25);
            const bits = (ver << 12) | resto;
            for (let i = 0; i < 18; i++) {
                const v = ((bits >>> i) & 1) !== 0;
                const a = tam - 11 + (i % 3);
                const b = Math.floor(i / 3);
                set(a, b, v);
                set(b, a, v);
            }
        }
        const dados = codewords(bytes, ver);
        let k = 0;
        for (let direita = tam - 1; direita >= 1; direita -= 2) {
            if (direita === 6)
                direita = 5;
            for (let vert = 0; vert < tam; vert++) {
                for (let j = 0; j < 2; j++) {
                    const x = direita - j;
                    const y = ((direita + 1) & 2) === 0 ? tam - 1 - vert : vert;
                    if (!fn[y][x] && k < dados.length * 8) {
                        base[y][x] = ((dados[k >>> 3] >>> (7 - (k & 7))) & 1) !== 0;
                        k++;
                    }
                }
            }
        }
        let melhor = base;
        let melhorNota = Infinity;
        for (let mascara = 0; mascara < 8; mascara++) {
            const copia = base.map((l) => l.slice());
            aplicarMascara(copia, fn, tam, mascara);
            desenharFormato(copia, fn, tam, mascara);
            const nota = penalidade(copia, tam);
            if (nota < melhorNota) {
                melhorNota = nota;
                melhor = copia;
            }
        }
        return melhor;
    }
    /** Converte a matriz em SVG (fundo branco e zona de silêncio de 4 módulos). */
    function qrParaSvg(matriz, borda = 4) {
        const tam = matriz.length + borda * 2;
        let caminho = "";
        matriz.forEach((linha, y) => {
            linha.forEach((escuro, x) => {
                if (escuro)
                    caminho += `M${x + borda},${y + borda}h1v1h-1z`;
            });
        });
        return (`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tam} ${tam}" shape-rendering="crispEdges" role="img" aria-label="QR Code Pix">` +
            `<rect width="100%" height="100%" fill="#fff"/><path d="${caminho}" fill="#000"/></svg>`);
    }
    /** Procura o bloco [data-pix-valor] da página e desenha QR Code + "copia e cola". */
    function iniciar() {
        var _a;
        const bloco = document.querySelector('[data-pix-valor]');
        if (!bloco)
            return;
        const valor = Number((_a = bloco.dataset.pixValor) !== null && _a !== void 0 ? _a : '0');
        if (!(valor > 0))
            return;
        const codigo = montarPix(valor);
        const alvo = bloco.querySelector('[data-pix-qr]');
        const campo = bloco.querySelector('[data-pix-codigo]');
        const botao = bloco.querySelector('[data-pix-copiar]');
        if (alvo)
            alvo.innerHTML = qrParaSvg(gerarQr(codigo));
        if (campo)
            campo.value = codigo;
        if (botao && campo) {
            botao.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(codigo);
                }
                catch {
                    campo.select();
                    document.execCommand('copy');
                }
                const original = botao.textContent;
                botao.textContent = 'Código copiado!';
                window.setTimeout(() => { botao.textContent = original; }, 2000);
            });
        }
    }
    iniciar();
})();
