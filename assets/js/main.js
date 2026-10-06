"use strict";
// assets/ts/main.ts — comportamento do lado do cliente da Y3D Creations
// PHP cuida dos dados e do carrinho (sessão); TypeScript cuida só da interface.
const CHAVE_FAVORITOS = 'y3d_favoritos';
function lerFavoritos() {
    try {
        const dados = localStorage.getItem(CHAVE_FAVORITOS);
        return dados ? JSON.parse(dados) : [];
    }
    catch {
        return [];
    }
}
function salvarFavoritos(lista) {
    try {
        localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(lista));
    }
    catch {
        /* localStorage indisponível: segue sem persistir */
    }
}
function alternarFavorito(id) {
    const lista = lerFavoritos();
    const indice = lista.indexOf(id);
    if (indice >= 0) {
        lista.splice(indice, 1);
    }
    else {
        lista.push(id);
    }
    salvarFavoritos(lista);
    return indice < 0; // true = acabou de favoritar
}
function iniciarBotoesFavoritos() {
    const favoritos = lerFavoritos();
    const botoes = document.querySelectorAll('[data-fav]');
    botoes.forEach((botao) => {
        const id = Number(botao.dataset.fav);
        if (favoritos.includes(id)) {
            marcarFavorito(botao, true);
        }
        botao.addEventListener('click', () => {
            const favoritado = alternarFavorito(id);
            marcarFavorito(botao, favoritado);
            mostrarToast(favoritado ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
            atualizarBadgeFavoritos();
        });
    });
}
function marcarFavorito(botao, ativo) {
    botao.setAttribute('aria-pressed', String(ativo));
    botao.textContent = ativo ? '♥' : '♡';
}
/** Bolinha com o número de favoritos, ao lado do ícone de coração no cabeçalho (em todas as páginas). */
function atualizarBadgeFavoritos() {
    const badge = document.getElementById('fav-count');
    if (!badge)
        return;
    const total = lerFavoritos().length;
    badge.textContent = String(total);
    badge.hidden = total === 0;
}
/** Página favoritos.php: mostra só os cartões de produto cujo id está nos favoritos salvos. */
function iniciarPaginaFavoritos() {
    const grid = document.getElementById('favoritos-grid');
    const vazio = document.getElementById('favoritos-vazio');
    const contagem = document.getElementById('favoritos-contagem');
    if (!grid || !vazio)
        return;
    const favoritos = lerFavoritos();
    const itens = grid.querySelectorAll('[data-produto-id]');
    let visiveis = 0;
    itens.forEach((item) => {
        const id = Number(item.dataset.produtoId);
        if (favoritos.includes(id)) {
            item.hidden = false;
            visiveis++;
        }
    });
    vazio.hidden = visiveis > 0;
    if (contagem)
        contagem.textContent = `${visiveis} produto${visiveis === 1 ? '' : 's'}`;
}
function iniciarSeletorQuantidade() {
    const menos = document.querySelector('[data-qty-menos]');
    const mais = document.querySelector('[data-qty-mais]');
    const valor = document.querySelector('[data-qty-valor]');
    const input = document.querySelector('[data-qty-input]');
    const comprarAgoraQuantidade = document.querySelector('[data-buy-now-quantity]');
    if (!menos || !mais || !valor || !input)
        return;
    let quantidade = 1;
    const atualizar = () => {
        valor.textContent = String(quantidade);
        input.value = String(quantidade);
        if (comprarAgoraQuantidade)
            comprarAgoraQuantidade.value = String(quantidade);
    };
    menos.addEventListener('click', () => {
        quantidade = Math.max(1, quantidade - 1);
        atualizar();
    });
    mais.addEventListener('click', () => {
        quantidade = Math.min(20, quantidade + 1);
        atualizar();
    });
}
function iniciarGaleriaProduto() {
    var _a, _b, _c;
    // Galeria do produto: miniaturas (leves) trocam a foto principal (alta resolução) e o clique abre o visualizador com zoom.
    const galeria = document.querySelector('[data-gallery]');
    const principal = document.querySelector('[data-gallery-main]');
    if (!galeria || !principal)
        return;
    let imagens = [];
    try {
        const lida = JSON.parse((_a = galeria.dataset.galleryImages) !== null && _a !== void 0 ? _a : '[]');
        if (Array.isArray(lida))
            imagens = lida.filter((item) => typeof item === 'string' && item !== '');
    }
    catch {
        imagens = [];
    }
    if (imagens.length === 0)
        imagens = [(_b = principal.getAttribute('src')) !== null && _b !== void 0 ? _b : ''];
    const nomeProduto = (_c = galeria.dataset.galleryNome) !== null && _c !== void 0 ? _c : '';
    const miniaturas = Array.from(galeria.querySelectorAll('[data-gallery-thumb]'));
    const listaMiniaturas = galeria.querySelector('[data-gallery-thumbs]');
    const botaoAbrir = galeria.querySelector('[data-gallery-open]');
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let atual = 0;
    let pedido = 0;
    function pre(indice) {
        const url = imagens[indice];
        if (url)
            new Image().src = url;
    }
    function mostrar(indice) {
        atual = (indice + imagens.length) % imagens.length;
        const url = imagens[atual];
        miniaturas.forEach((miniatura, i) => {
            const ativa = i === atual;
            miniatura.classList.toggle('is-active', ativa);
            if (ativa)
                miniatura.setAttribute('aria-current', 'true');
            else
                miniatura.removeAttribute('aria-current');
        });
        // mantém a miniatura ativa visível na faixa (rola só a faixa, não a página)
        const ativa = miniaturas[atual];
        if (ativa && listaMiniaturas) {
            const vertical = listaMiniaturas.scrollHeight > listaMiniaturas.clientHeight + 1 && listaMiniaturas.clientWidth <= 100;
            if (vertical)
                listaMiniaturas.scrollTo({ top: ativa.offsetTop - listaMiniaturas.clientHeight / 2 + ativa.offsetHeight / 2 });
            else
                listaMiniaturas.scrollTo({ left: ativa.offsetLeft - listaMiniaturas.clientWidth / 2 + ativa.offsetWidth / 2 });
        }
        if (principal.getAttribute('src') === url)
            return;
        const meuPedido = ++pedido;
        const aplicar = () => {
            if (meuPedido !== pedido)
                return;
            principal.src = url;
            principal.alt = imagens.length > 1 ? `${nomeProduto} (foto ${atual + 1} de ${imagens.length})` : nomeProduto;
            principal.classList.remove('trocando');
        };
        if (reduzirMovimento) {
            aplicar();
        }
        else {
            principal.classList.add('trocando'); // some rápido, troca a foto já carregada e volta
            const carregando = new Image();
            carregando.onload = () => window.setTimeout(aplicar, 120);
            carregando.onerror = aplicar;
            carregando.src = url;
        }
    }
    miniaturas.forEach((miniatura, i) => miniatura.addEventListener('click', () => mostrar(i)));
    if (imagens.length > 1)
        pre(1);
    if (!botaoAbrir)
        return;
    // ---------- visualizador ampliado (lightbox) ----------
    const caixa = document.createElement('div');
    caixa.className = 'lightbox';
    caixa.hidden = true;
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-modal', 'true');
    caixa.setAttribute('aria-label', `Imagem ampliada de ${nomeProduto}`);
    caixa.innerHTML = `
    <button type="button" class="lightbox-fechar" aria-label="Fechar">✕</button>
    <button type="button" class="lightbox-seta lightbox-anterior" aria-label="Foto anterior">←</button>
    <div class="lightbox-palco"><img class="lightbox-img" alt="" draggable="false"></div>
    <button type="button" class="lightbox-seta lightbox-proxima" aria-label="Próxima foto">→</button>
    <div class="lightbox-zoom">
      <button type="button" data-lb-menos aria-label="Diminuir zoom">−</button>
      <span data-lb-info aria-live="polite"></span>
      <button type="button" data-lb-mais aria-label="Aumentar zoom">+</button>
    </div>`;
    document.body.appendChild(caixa);
    const palco = caixa.querySelector('.lightbox-palco');
    const imgGrande = caixa.querySelector('.lightbox-img');
    const info = caixa.querySelector('[data-lb-info]');
    const setaAnterior = caixa.querySelector('.lightbox-anterior');
    const setaProxima = caixa.querySelector('.lightbox-proxima');
    const ZOOM_MAX = 5;
    let aberto = false;
    let escala = 1;
    let tx = 0;
    let ty = 0;
    let posicaoScroll = 0;
    function limitar() {
        const maxX = Math.max(0, (imgGrande.clientWidth * escala - palco.clientWidth) / 2);
        const maxY = Math.max(0, (imgGrande.clientHeight * escala - palco.clientHeight) / 2);
        tx = Math.min(maxX, Math.max(-maxX, tx));
        ty = Math.min(maxY, Math.max(-maxY, ty));
    }
    function aplicarZoom() {
        if (escala <= 1) {
            escala = 1;
            tx = 0;
            ty = 0;
        }
        else {
            limitar();
        }
        imgGrande.style.transform = `translate(${tx}px, ${ty}px) scale(${escala})`;
        palco.classList.toggle('com-zoom', escala > 1);
        const posicao = imagens.length > 1 ? `${atual + 1}/${imagens.length} · ` : '';
        info.textContent = `${posicao}${Math.round(escala * 100)}%`;
    }
    // dá zoom mantendo o ponto (px, py), medido a partir do centro do palco, parado na tela
    function zoomEm(novaEscala, px, py) {
        const alvo = Math.min(ZOOM_MAX, Math.max(1, novaEscala));
        const razao = alvo / escala;
        tx = px - (px - tx) * razao;
        ty = py - (py - ty) * razao;
        escala = alvo;
        aplicarZoom();
    }
    function mostrarNoVisualizador(indice) {
        mostrar(indice);
        escala = 1;
        tx = 0;
        ty = 0;
        imgGrande.src = imagens[atual]; // sempre a versão em alta resolução
        imgGrande.alt = principal.alt;
        aplicarZoom();
        pre(atual + 1);
    }
    function abrir() {
        if (aberto)
            return;
        aberto = true;
        posicaoScroll = window.scrollY;
        const larguraBarra = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (larguraBarra > 0)
            document.body.style.paddingRight = `${larguraBarra}px`;
        const varias = imagens.length > 1;
        setaAnterior.hidden = !varias;
        setaProxima.hidden = !varias;
        caixa.hidden = false;
        mostrarNoVisualizador(atual);
        caixa.querySelector('.lightbox-fechar').focus();
    }
    function fechar() {
        if (!aberto)
            return;
        aberto = false;
        caixa.hidden = true;
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, posicaoScroll); // volta exatamente para onde a pessoa estava
        botaoAbrir.focus({ preventScroll: true });
    }
    botaoAbrir.addEventListener('click', abrir);
    caixa.querySelector('.lightbox-fechar').addEventListener('click', fechar);
    setaAnterior.addEventListener('click', () => mostrarNoVisualizador(atual - 1));
    setaProxima.addEventListener('click', () => mostrarNoVisualizador(atual + 1));
    caixa.addEventListener('click', (evento) => {
        if (evento.target === caixa || evento.target === palco) {
            if (escala === 1 && evento.target === caixa)
                fechar();
        }
    });
    caixa.querySelector('[data-lb-mais]').addEventListener('click', () => zoomEm(escala * 1.5, 0, 0));
    caixa.querySelector('[data-lb-menos]').addEventListener('click', () => zoomEm(escala / 1.5, 0, 0));
    // roda do mouse = zoom no ponto apontado
    palco.addEventListener('wheel', (evento) => {
        evento.preventDefault();
        const caixaPalco = palco.getBoundingClientRect();
        const px = evento.clientX - (caixaPalco.left + caixaPalco.width / 2);
        const py = evento.clientY - (caixaPalco.top + caixaPalco.height / 2);
        zoomEm(escala * (evento.deltaY < 0 ? 1.2 : 1 / 1.2), px, py);
    }, { passive: false });
    // arrastar = mover a imagem ampliada (ou passar de foto, se não houver zoom); clique simples = zoom
    let inicioX = 0;
    let inicioY = 0;
    let baseX = 0;
    let baseY = 0;
    let moveu = false;
    let apertando = false;
    palco.addEventListener('pointerdown', (evento) => {
        apertando = true;
        moveu = false;
        inicioX = evento.clientX;
        inicioY = evento.clientY;
        baseX = tx;
        baseY = ty;
        palco.setPointerCapture(evento.pointerId);
    });
    palco.addEventListener('pointermove', (evento) => {
        if (!apertando)
            return;
        const dx = evento.clientX - inicioX;
        const dy = evento.clientY - inicioY;
        if (Math.abs(dx) + Math.abs(dy) > 5)
            moveu = true;
        if (escala > 1 && moveu) {
            palco.classList.add('arrastando');
            tx = baseX + dx;
            ty = baseY + dy;
            aplicarZoom();
        }
    });
    palco.addEventListener('pointerup', (evento) => {
        if (!apertando)
            return;
        apertando = false;
        palco.classList.remove('arrastando');
        const dx = evento.clientX - inicioX;
        if (!moveu) {
            if (escala > 1) {
                zoomEm(1, 0, 0);
            }
            else {
                const caixaPalco = palco.getBoundingClientRect();
                zoomEm(2.5, evento.clientX - (caixaPalco.left + caixaPalco.width / 2), evento.clientY - (caixaPalco.top + caixaPalco.height / 2));
            }
        }
        else if (escala === 1 && Math.abs(dx) > 50 && imagens.length > 1) {
            mostrarNoVisualizador(atual + (dx < 0 ? 1 : -1));
        }
    });
    palco.addEventListener('pointercancel', () => {
        apertando = false;
        palco.classList.remove('arrastando');
    });
    document.addEventListener('keydown', (evento) => {
        if (!aberto)
            return;
        if (evento.key === 'Escape')
            fechar();
        else if (evento.key === 'ArrowLeft' && imagens.length > 1)
            mostrarNoVisualizador(atual - 1);
        else if (evento.key === 'ArrowRight' && imagens.length > 1)
            mostrarNoVisualizador(atual + 1);
        else if (evento.key === '+' || evento.key === '=')
            zoomEm(escala * 1.5, 0, 0);
        else if (evento.key === '-')
            zoomEm(escala / 1.5, 0, 0);
        else if (evento.key === '0')
            zoomEm(1, 0, 0);
        else if (evento.key === 'Tab') {
            // mantém o foco dentro do visualizador
            const focaveis = Array.from(caixa.querySelectorAll('button')).filter((botao) => !botao.hidden);
            const primeiro = focaveis[0];
            const ultimo = focaveis[focaveis.length - 1];
            if (evento.shiftKey && document.activeElement === primeiro) {
                evento.preventDefault();
                ultimo.focus();
            }
            else if (!evento.shiftKey && document.activeElement === ultimo) {
                evento.preventDefault();
                primeiro.focus();
            }
        }
    });
    window.addEventListener('resize', () => {
        if (aberto)
            aplicarZoom();
    });
}
function iniciarCalculoFrete() {
    const campoCep = document.querySelector('#checkout-cep');
    const freteElemento = document.querySelector('[data-checkout-freight]');
    const totalElemento = document.querySelector('[data-checkout-total]');
    const subtotalElemento = document.querySelector('[data-checkout-subtotal]');
    if (!campoCep || !freteElemento || !totalElemento || !subtotalElemento)
        return;
    const faixasPorRegiao = {
        '0': 9.9, '1': 14.9, '2': 19.9, '3': 24.9, '4': 29.9,
        '5': 34.9, '6': 39.9, '7': 34.9, '8': 24.9, '9': 29.9,
    };
    const dinheiro = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;
    const atualizarFrete = () => {
        var _a, _b;
        const cep = campoCep.value.replace(/\D/g, '');
        const subtotal = Number((_a = subtotalElemento.dataset.checkoutSubtotal) !== null && _a !== void 0 ? _a : '0');
        if (cep.length !== 8) {
            freteElemento.textContent = 'Informe seu CEP';
            totalElemento.textContent = dinheiro(subtotal);
            return;
        }
        const frete = subtotal >= 150 ? 0 : ((_b = faixasPorRegiao[cep[0]]) !== null && _b !== void 0 ? _b : 39.9);
        freteElemento.textContent = frete === 0 ? 'Grátis' : dinheiro(frete);
        totalElemento.textContent = dinheiro(subtotal + frete);
    };
    campoCep.addEventListener('input', atualizarFrete);
    atualizarFrete();
}
let toastTimer;
function mostrarToast(mensagem) {
    const caixa = document.getElementById('toast');
    if (!caixa)
        return;
    caixa.textContent = mensagem;
    caixa.classList.add('on');
    if (toastTimer !== undefined)
        window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => caixa.classList.remove('on'), 2600);
}
function iniciarMostrarSenha() {
    document.querySelectorAll('[data-toggle-senha]').forEach((botao) => {
        botao.addEventListener('click', () => {
            var _a;
            const campo = document.getElementById((_a = botao.dataset.toggleSenha) !== null && _a !== void 0 ? _a : '');
            if (!campo)
                return;
            const mostrar = campo.type === 'password';
            campo.type = mostrar ? 'text' : 'password';
            botao.setAttribute('aria-pressed', String(mostrar));
            botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
        });
    });
}
function iniciarLoginGoogle() {
    // Este botão só aparece quando includes/config.php ainda não tem um Client ID do Google configurado.
    document.querySelectorAll('[data-login-google]').forEach((botao) => {
        botao.addEventListener('click', () => {
            mostrarToast('Login com Google ainda não configurado: veja includes/config.php');
        });
    });
}
function iniciarCarrosselBt21() {
    // Carrossel da promoção BT21: setas, bolinhas, deslizar com o dedo e avanço automático.
    const raiz = document.querySelector('[data-bt21]');
    if (!raiz)
        return;
    const pista = raiz.querySelector('[data-bt21-pista]');
    const anterior = raiz.querySelector('[data-bt21-anterior]');
    const proximo = raiz.querySelector('[data-bt21-proximo]');
    const pontos = raiz.querySelector('[data-bt21-pontos]');
    const cards = Array.from(raiz.querySelectorAll('[data-bt21-card]'));
    if (!pista || !anterior || !proximo || !pontos || cards.length === 0)
        return;
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let atual = 0;
    let pausado = false;
    const botoesPonto = cards.map((card, i) => {
        var _a;
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'bt21-ponto';
        botao.setAttribute('aria-label', `Ver ${(_a = card.dataset.nome) !== null && _a !== void 0 ? _a : 'personagem'}`);
        botao.addEventListener('click', () => irPara(i));
        pontos.appendChild(botao);
        return botao;
    });
    function marcarAtual() {
        botoesPonto.forEach((botao, i) => botao.classList.toggle('on', i === atual));
        cards.forEach((card, i) => card.classList.toggle('ativo', i === atual));
    }
    function irPara(indice) {
        atual = (indice + cards.length) % cards.length;
        const card = cards[atual];
        const alvo = card.offsetLeft - (pista.clientWidth - card.offsetWidth) / 2;
        pista.scrollTo({ left: alvo, behavior: reduzirMovimento ? 'auto' : 'smooth' });
        marcarAtual();
    }
    // Se a pessoa arrastar com o dedo/mouse, acompanha qual card ficou no centro.
    let aguardandoFrame = false;
    pista.addEventListener('scroll', () => {
        if (aguardandoFrame)
            return;
        aguardandoFrame = true;
        requestAnimationFrame(() => {
            aguardandoFrame = false;
            const centro = pista.scrollLeft + pista.clientWidth / 2;
            let maisPerto = atual;
            let menorDistancia = Infinity;
            cards.forEach((card, i) => {
                const distancia = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centro);
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    maisPerto = i;
                }
            });
            if (maisPerto !== atual) {
                atual = maisPerto;
                marcarAtual();
            }
        });
    });
    anterior.addEventListener('click', () => irPara(atual - 1));
    proximo.addEventListener('click', () => irPara(atual + 1));
    pista.addEventListener('keydown', (evento) => {
        if (evento.key === 'ArrowLeft')
            irPara(atual - 1);
        if (evento.key === 'ArrowRight')
            irPara(atual + 1);
    });
    if (!reduzirMovimento) {
        ['mouseenter', 'focusin', 'touchstart'].forEach((nome) => raiz.addEventListener(nome, () => { pausado = true; }, { passive: true }));
        ['mouseleave', 'focusout', 'touchend'].forEach((nome) => raiz.addEventListener(nome, () => { pausado = false; }, { passive: true }));
        window.setInterval(() => {
            if (!pausado && !document.hidden)
                irPara(atual + 1);
        }, 4500);
    }
    marcarAtual();
    irPara(0);
}
document.addEventListener('DOMContentLoaded', () => {
    iniciarBotoesFavoritos();
    atualizarBadgeFavoritos();
    iniciarPaginaFavoritos();
    iniciarSeletorQuantidade();
    iniciarGaleriaProduto();
    iniciarCalculoFrete();
    iniciarMostrarSenha();
    iniciarLoginGoogle();
    iniciarCarrosselBt21();
});
