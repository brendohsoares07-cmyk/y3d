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
      atualizarBadgeFavoritos();
    });
  });
}

function marcarFavorito(botao: HTMLButtonElement, ativo: boolean): void {
  botao.setAttribute('aria-pressed', String(ativo));
  botao.textContent = ativo ? '♥' : '♡';
}

/** Bolinha com o número de favoritos, ao lado do ícone de coração no cabeçalho (em todas as páginas). */
function atualizarBadgeFavoritos(): void {
  const badge = document.getElementById('fav-count');
  if (!badge) return;
  const total = lerFavoritos().length;
  badge.textContent = String(total);
  badge.hidden = total === 0;
}

/** Página favoritos.php: mostra só os cartões de produto cujo id está nos favoritos salvos. */
function iniciarPaginaFavoritos(): void {
  const grid = document.getElementById('favoritos-grid');
  const vazio = document.getElementById('favoritos-vazio');
  const contagem = document.getElementById('favoritos-contagem');
  if (!grid || !vazio) return;

  const favoritos = lerFavoritos();
  const itens = grid.querySelectorAll<HTMLElement>('[data-produto-id]');
  let visiveis = 0;

  itens.forEach((item) => {
    const id = Number(item.dataset.produtoId);
    if (favoritos.includes(id)) {
      item.hidden = false;
      visiveis++;
    }
  });

  vazio.hidden = visiveis > 0;
  if (contagem) contagem.textContent = `${visiveis} produto${visiveis === 1 ? '' : 's'}`;
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

let toastTimer: number | undefined;

function mostrarToast(mensagem: string): void {
  const caixa = document.getElementById('toast');
  if (!caixa) return;
  caixa.textContent = mensagem;
  caixa.classList.add('on');
  if (toastTimer !== undefined) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => caixa.classList.remove('on'), 2600);
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

function iniciarCarrosselBt21(): void {
  // Carrossel da promoção BT21: setas, bolinhas, deslizar com o dedo e avanço automático.
  const raiz = document.querySelector<HTMLElement>('[data-bt21]');
  if (!raiz) return;
  const pista = raiz.querySelector<HTMLElement>('[data-bt21-pista]');
  const anterior = raiz.querySelector<HTMLButtonElement>('[data-bt21-anterior]');
  const proximo = raiz.querySelector<HTMLButtonElement>('[data-bt21-proximo]');
  const pontos = raiz.querySelector<HTMLElement>('[data-bt21-pontos]');
  const cards = Array.from(raiz.querySelectorAll<HTMLElement>('[data-bt21-card]'));
  if (!pista || !anterior || !proximo || !pontos || cards.length === 0) return;

  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let atual = 0;
  let pausado = false;

  const botoesPonto = cards.map((card, i) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'bt21-ponto';
    botao.setAttribute('aria-label', `Ver ${card.dataset.nome ?? 'personagem'}`);
    botao.addEventListener('click', () => irPara(i));
    pontos.appendChild(botao);
    return botao;
  });

  function marcarAtual(): void {
    botoesPonto.forEach((botao, i) => botao.classList.toggle('on', i === atual));
    cards.forEach((card, i) => card.classList.toggle('ativo', i === atual));
  }

  function irPara(indice: number): void {
    atual = (indice + cards.length) % cards.length;
    const card = cards[atual];
    const alvo = card.offsetLeft - (pista!.clientWidth - card.offsetWidth) / 2;
    pista!.scrollTo({ left: alvo, behavior: reduzirMovimento ? 'auto' : 'smooth' });
    marcarAtual();
  }

  // Se a pessoa arrastar com o dedo/mouse, acompanha qual card ficou no centro.
  let aguardandoFrame = false;
  pista.addEventListener('scroll', () => {
    if (aguardandoFrame) return;
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
    if (evento.key === 'ArrowLeft') irPara(atual - 1);
    if (evento.key === 'ArrowRight') irPara(atual + 1);
  });

  if (!reduzirMovimento) {
    ['mouseenter', 'focusin', 'touchstart'].forEach((nome) => raiz.addEventListener(nome, () => { pausado = true; }, { passive: true }));
    ['mouseleave', 'focusout', 'touchend'].forEach((nome) => raiz.addEventListener(nome, () => { pausado = false; }, { passive: true }));
    window.setInterval(() => {
      if (!pausado && !document.hidden) irPara(atual + 1);
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
  iniciarMostrarSenha();
  iniciarCarrosselBt21();
});
