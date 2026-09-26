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
        });
    });
}
function marcarFavorito(botao, ativo) {
    botao.setAttribute('aria-pressed', String(ativo));
    botao.textContent = ativo ? '♥' : '♡';
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
function mostrarToast(mensagem) {
    const caixa = document.getElementById('toast');
    if (!caixa)
        return;
    caixa.textContent = mensagem;
    caixa.classList.add('on');
    window.clearTimeout(caixa._t);
    caixa._t = window.setTimeout(() => caixa.classList.remove('on'), 2600);
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
document.addEventListener('DOMContentLoaded', () => {
    iniciarBotoesFavoritos();
    iniciarSeletorQuantidade();
    iniciarGaleriaProduto();
    iniciarCalculoFrete();
    iniciarMostrarSenha();
    iniciarLoginGoogle();
});
