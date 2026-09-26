// assets/ts/main.ts — comportamento do lado do cliente da Y3D Creations
// PHP cuida dos dados e do carrinho (sessão); TypeScript cuida só da interface.

type Favoritos = number[];

const CHAVE_FAVORITOS = 'y3d_favoritos';

function lerFavoritos(): Favoritos {
  try {
    const dados = localStorage.getItem(CHAVE_FAVORITOS);
    return dados ? (JSON.parse(dados) as Favoritos) : [];
  } catch {
    return [];
  }
}

function salvarFavoritos(lista: Favoritos): void {
  try {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(lista));
  } catch {
    /* localStorage indisponível: segue sem persistir */
  }
}

function alternarFavorito(id: number): boolean {
  const lista = lerFavoritos();
  const indice = lista.indexOf(id);
  if (indice >= 0) {
    lista.splice(indice, 1);
  } else {
    lista.push(id);
  }
  salvarFavoritos(lista);
  return indice < 0; // true = acabou de favoritar
}

function iniciarBotoesFavoritos(): void {
  const favoritos = lerFavoritos();
  const botoes = document.querySelectorAll<HTMLButtonElement>('[data-fav]');

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

function marcarFavorito(botao: HTMLButtonElement, ativo: boolean): void {
  botao.setAttribute('aria-pressed', String(ativo));
  botao.textContent = ativo ? '♥' : '♡';
}

function iniciarSeletorQuantidade(): void {
  const menos = document.querySelector<HTMLButtonElement>('[data-qty-menos]');
  const mais = document.querySelector<HTMLButtonElement>('[data-qty-mais]');
  const valor = document.querySelector<HTMLElement>('[data-qty-valor]');
  const input = document.querySelector<HTMLInputElement>('[data-qty-input]');
  const comprarAgoraQuantidade = document.querySelector<HTMLInputElement>('[data-buy-now-quantity]');
  if (!menos || !mais || !valor || !input) return;

  let quantidade = 1;
  const atualizar = () => {
    valor.textContent = String(quantidade);
    input.value = String(quantidade);
    if (comprarAgoraQuantidade) comprarAgoraQuantidade.value = String(quantidade);
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

function iniciarGaleriaProduto(): void {
  const imagemPrincipal = document.querySelector<HTMLImageElement>('[data-gallery-main]');
  const miniaturas = document.querySelectorAll<HTMLButtonElement>('[data-gallery-thumb]');
  if (!imagemPrincipal || miniaturas.length === 0) return;

  miniaturas.forEach((miniatura) => {
    miniatura.addEventListener('click', () => {
      const imagem = miniatura.dataset.galleryThumb;
      if (!imagem) return;
      imagemPrincipal.src = imagem;
      miniaturas.forEach((item) => item.classList.remove('is-active'));
      miniatura.classList.add('is-active');
    });
  });
}

function iniciarCalculoFrete(): void {
  const campoCep = document.querySelector<HTMLInputElement>('#checkout-cep');
  const freteElemento = document.querySelector<HTMLElement>('[data-checkout-freight]');
  const totalElemento = document.querySelector<HTMLElement>('[data-checkout-total]');
  const subtotalElemento = document.querySelector<HTMLElement>('[data-checkout-subtotal]');
  if (!campoCep || !freteElemento || !totalElemento || !subtotalElemento) return;

  const faixasPorRegiao: Record<string, number> = {
    '0': 9.9, '1': 14.9, '2': 19.9, '3': 24.9, '4': 29.9,
    '5': 34.9, '6': 39.9, '7': 34.9, '8': 24.9, '9': 29.9,
  };
  const dinheiro = (valor: number): string => `R$ ${valor.toFixed(2).replace('.', ',')}`;

  const atualizarFrete = () => {
    const cep = campoCep.value.replace(/\D/g, '');
    const subtotal = Number(subtotalElemento.dataset.checkoutSubtotal ?? '0');
    if (cep.length !== 8) {
      freteElemento.textContent = 'Informe seu CEP';
      totalElemento.textContent = dinheiro(subtotal);
      return;
    }
    const frete = subtotal >= 150 ? 0 : (faixasPorRegiao[cep[0]] ?? 39.9);
    freteElemento.textContent = frete === 0 ? 'Grátis' : dinheiro(frete);
    totalElemento.textContent = dinheiro(subtotal + frete);
  };

  campoCep.addEventListener('input', atualizarFrete);
  atualizarFrete();
}

function mostrarToast(mensagem: string): void {
  const caixa = document.getElementById('toast');
  if (!caixa) return;
  caixa.textContent = mensagem;
  caixa.classList.add('on');
  window.clearTimeout((caixa as any)._t);
  (caixa as any)._t = window.setTimeout(() => caixa.classList.remove('on'), 2600);
}


function iniciarMostrarSenha(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-toggle-senha]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const campo = document.getElementById(botao.dataset.toggleSenha ?? '') as HTMLInputElement | null;
      if (!campo) return;
      const mostrar = campo.type === 'password';
      campo.type = mostrar ? 'text' : 'password';
      botao.setAttribute('aria-pressed', String(mostrar));
      botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
    });
  });
}

function iniciarLoginGoogle(): void {
  document.querySelectorAll('[data-login-google]').forEach((botao) => {
    botao.addEventListener('click', () => {
      mostrarToast('Login com Google indisponível na versão de demonstração');
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
