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
    const imagemPrincipal = document.querySelector('[data-gallery-main]');
    const miniaturas = document.querySelectorAll('[data-gallery-thumb]');
    if (!imagemPrincipal || miniaturas.length === 0)
        return;
    miniaturas.forEach((miniatura) => {
        miniatura.addEventListener('click', () => {
            const imagem = miniatura.dataset.galleryThumb;
            if (!imagem)
                return;
            imagemPrincipal.src = imagem;
            miniaturas.forEach((item) => item.classList.remove('is-active'));
            miniatura.classList.add('is-active');
        });
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
