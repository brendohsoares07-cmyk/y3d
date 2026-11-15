import { useCallback, useEffect, useRef, useState, type PointerEvent as EventoPonteiro } from "react";
import { createPortal } from "react-dom";
import { srcImagem } from "./CartaoProduto";

const ZOOM_MAX = 5;

interface Props { nome: string; emoji: string; imagens: string[]; miniaturas: string[] }

/** Galeria do produto: miniaturas trocam a foto principal e o clique abre o visualizador com zoom (porta de ts/main.ts). */
export function GaleriaProduto({ nome, emoji, imagens, miniaturas }: Props) {
  const [atual, setAtual] = useState(0);
  const [exibida, setExibida] = useState(0);
  const [trocando, setTrocando] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoAbrir = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const pedido = useRef(0);
  const total = imagens.length;

  const alt = (i: number): string => (total > 1 ? `${nome} (foto ${i + 1} de ${total})` : nome);

  const mostrar = useCallback((indice: number) => {
    setAtual((indice + total) % total);
  }, [total]);

  // troca a foto principal com uma transição curta, esperando a nova carregar
  useEffect(() => {
    if (atual === exibida) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzir) { setExibida(atual); return; }
    const meu = ++pedido.current;
    setTrocando(true);
    const aplicar = (): void => { if (meu === pedido.current) { setExibida(atual); setTrocando(false); } };
    const img = new Image();
    img.onload = () => window.setTimeout(aplicar, 120);
    img.onerror = aplicar;
    img.src = srcImagem(imagens[atual]);
  }, [atual, exibida, imagens]);

  // mantém a miniatura ativa visível na faixa (rola só a faixa, não a página)
  useEffect(() => {
    const faixa = lista.current;
    const ativa = faixa?.children[atual] as HTMLElement | undefined;
    if (!faixa || !ativa) return;
    const vertical = faixa.scrollHeight > faixa.clientHeight + 1 && faixa.clientWidth <= 100;
    if (vertical) faixa.scrollTo({ top: ativa.offsetTop - faixa.clientHeight / 2 + ativa.offsetHeight / 2 });
    else faixa.scrollTo({ left: ativa.offsetLeft - faixa.clientWidth / 2 + ativa.offsetWidth / 2 });
  }, [atual]);

  useEffect(() => { if (total > 1) new Image().src = srcImagem(imagens[1]); }, [imagens, total]);

  const fechar = useCallback(() => {
    setAberto(false);
    window.setTimeout(() => botaoAbrir.current?.focus({ preventScroll: true }), 0);
  }, []);

  return (
    <section className={`product-gallery${total < 2 ? " no-thumbs" : ""}`} aria-label="Galeria de imagens">
      {total > 1 && (
        <div className="product-gallery-thumbs" ref={lista}>
          {imagens.map((_, i) => (
            <button key={i} type="button" className={`product-gallery-thumb${i === atual ? " is-active" : ""}`} aria-label={`Ver foto ${i + 1} de ${total}`} aria-current={i === atual ? "true" : undefined} onClick={() => mostrar(i)}>
              <img src={srcImagem(miniaturas[i] ?? imagens[i])} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
      {total > 0 ? (
        <button type="button" className="product-gallery-main" ref={botaoAbrir} aria-label={`Ampliar imagem de ${nome}`} onClick={() => setAberto(true)}>
          <img src={srcImagem(imagens[exibida] ?? imagens[0])} alt={alt(exibida)} className={trocando ? "trocando" : undefined} decoding="async" />
        </button>
      ) : (
        <div className="product-gallery-main"><span className="product-gallery-emoji">{emoji}</span></div>
      )}
      {aberto && <Visualizador nome={nome} imagens={imagens} inicial={atual} aoTrocar={mostrar} aoFechar={fechar} alt={alt} />}
    </section>
  );
}

interface PropsVisualizador { nome: string; imagens: string[]; inicial: number; aoTrocar: (i: number) => void; aoFechar: () => void; alt: (i: number) => string }

function Visualizador({ nome, imagens, inicial, aoTrocar, aoFechar, alt }: PropsVisualizador) {
  const total = imagens.length;
  const [indice, setIndice] = useState(inicial);
  const [escala, setEscala] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [arrastando, setArrastando] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const imagem = useRef<HTMLImageElement>(null);
  const estado = useRef({ escala: 1, x: 0, y: 0 });
  const gesto = useRef({ ativo: false, moveu: false, ix: 0, iy: 0, bx: 0, by: 0 });

  const aplicar = useCallback((e: number, x: number, y: number) => {
    const img = imagem.current;
    const p = palco.current;
    let tx = x;
    let ty = y;
    let esc = e;
    if (esc <= 1) { esc = 1; tx = 0; ty = 0; }
    else if (img && p) {
      const maxX = Math.max(0, (img.clientWidth * esc - p.clientWidth) / 2);
      const maxY = Math.max(0, (img.clientHeight * esc - p.clientHeight) / 2);
      tx = Math.min(maxX, Math.max(-maxX, tx));
      ty = Math.min(maxY, Math.max(-maxY, ty));
    }
    estado.current = { escala: esc, x: tx, y: ty };
    setEscala(esc);
    setPos({ x: tx, y: ty });
  }, []);

  // dá zoom mantendo o ponto (px, py), medido a partir do centro do palco, parado na tela
  const zoomEm = useCallback((nova: number, px: number, py: number) => {
    const { escala: e, x, y } = estado.current;
    const alvo = Math.min(ZOOM_MAX, Math.max(1, nova));
    const razao = alvo / e;
    aplicar(alvo, px - (px - x) * razao, py - (py - y) * razao);
  }, [aplicar]);

  const ir = useCallback((i: number) => {
    const novo = (i + total) % total;
    setIndice(novo);
    aoTrocar(novo);
    estado.current = { escala: 1, x: 0, y: 0 };
    setEscala(1);
    setPos({ x: 0, y: 0 });
    const prox = imagens[(novo + 1) % total];
    if (prox) new Image().src = srcImagem(prox);
  }, [total, aoTrocar, imagens]);

  // trava a rolagem da página e devolve o foco ao fechar
  useEffect(() => {
    const posicao = window.scrollY;
    const barra = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (barra > 0) document.body.style.paddingRight = `${barra}px`;
    caixa.current?.querySelector<HTMLButtonElement>(".lightbox-fechar")?.focus();
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, posicao);
    };
  }, []);

  // roda do mouse = zoom no ponto apontado (precisa de ouvinte não passivo)
  useEffect(() => {
    const p = palco.current;
    if (!p) return;
    const aoRolar = (ev: WheelEvent): void => {
      ev.preventDefault();
      const r = p.getBoundingClientRect();
      zoomEm(estado.current.escala * (ev.deltaY < 0 ? 1.2 : 1 / 1.2), ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height / 2));
    };
    p.addEventListener("wheel", aoRolar, { passive: false });
    return () => p.removeEventListener("wheel", aoRolar);
  }, [zoomEm]);

  useEffect(() => {
    const aoTeclar = (ev: KeyboardEvent): void => {
      if (ev.key === "Escape") aoFechar();
      else if (ev.key === "ArrowLeft" && total > 1) ir(indice - 1);
      else if (ev.key === "ArrowRight" && total > 1) ir(indice + 1);
      else if (ev.key === "+" || ev.key === "=") zoomEm(estado.current.escala * 1.5, 0, 0);
      else if (ev.key === "-") zoomEm(estado.current.escala / 1.5, 0, 0);
      else if (ev.key === "0") zoomEm(1, 0, 0);
      else if (ev.key === "Tab" && caixa.current) {
        // mantém o foco dentro do visualizador
        const focaveis = Array.from(caixa.current.querySelectorAll<HTMLButtonElement>("button")).filter((b) => !b.hidden);
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (ev.shiftKey && document.activeElement === primeiro) { ev.preventDefault(); ultimo.focus(); }
        else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primeiro.focus(); }
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aoFechar, ir, indice, total, zoomEm]);

  useEffect(() => {
    const aoRedimensionar = (): void => aplicar(estado.current.escala, estado.current.x, estado.current.y);
    window.addEventListener("resize", aoRedimensionar);
    return () => window.removeEventListener("resize", aoRedimensionar);
  }, [aplicar]);

  const apertar = (ev: EventoPonteiro<HTMLDivElement>): void => {
    gesto.current = { ativo: true, moveu: false, ix: ev.clientX, iy: ev.clientY, bx: estado.current.x, by: estado.current.y };
    ev.currentTarget.setPointerCapture(ev.pointerId);
  };
  const mover = (ev: EventoPonteiro<HTMLDivElement>): void => {
    const g = gesto.current;
    if (!g.ativo) return;
    const dx = ev.clientX - g.ix;
    const dy = ev.clientY - g.iy;
    if (Math.abs(dx) + Math.abs(dy) > 5) g.moveu = true;
    if (estado.current.escala > 1 && g.moveu) {
      setArrastando(true);
      aplicar(estado.current.escala, g.bx + dx, g.by + dy);
    }
  };
  const soltar = (ev: EventoPonteiro<HTMLDivElement>): void => {
    const g = gesto.current;
    if (!g.ativo) return;
    g.ativo = false;
    setArrastando(false);
    const dx = ev.clientX - g.ix;
    if (!g.moveu) {
      if (estado.current.escala > 1) zoomEm(1, 0, 0);
      else {
        const r = ev.currentTarget.getBoundingClientRect();
        zoomEm(2.5, ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height / 2));
      }
    } else if (estado.current.escala === 1 && Math.abs(dx) > 50 && total > 1) {
      ir(indice + (dx < 0 ? 1 : -1));
    }
  };

  const posicao = total > 1 ? `${indice + 1}/${total} · ` : "";
  return createPortal(
    <div className="lightbox" ref={caixa} role="dialog" aria-modal="true" aria-label={`Imagem ampliada de ${nome}`}
      onClick={(ev) => { if (ev.target === ev.currentTarget && estado.current.escala === 1) aoFechar(); }}>
      <button type="button" className="lightbox-fechar" aria-label="Fechar" onClick={aoFechar}>✕</button>
      <button type="button" className="lightbox-seta lightbox-anterior" aria-label="Foto anterior" hidden={total < 2} onClick={() => ir(indice - 1)}>←</button>
      <div className={`lightbox-palco${escala > 1 ? " com-zoom" : ""}${arrastando ? " arrastando" : ""}`} ref={palco}
        onPointerDown={apertar} onPointerMove={mover} onPointerUp={soltar}
        onPointerCancel={() => { gesto.current.ativo = false; setArrastando(false); }}>
        <img className="lightbox-img" ref={imagem} src={srcImagem(imagens[indice])} alt={alt(indice)} draggable={false}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${escala})` }} />
      </div>
      <button type="button" className="lightbox-seta lightbox-proxima" aria-label="Próxima foto" hidden={total < 2} onClick={() => ir(indice + 1)}>→</button>
      <div className="lightbox-zoom">
        <button type="button" aria-label="Diminuir zoom" onClick={() => zoomEm(estado.current.escala / 1.5, 0, 0)}>−</button>
        <span aria-live="polite">{posicao}{Math.round(escala * 100)}%</span>
        <button type="button" aria-label="Aumentar zoom" onClick={() => zoomEm(estado.current.escala * 1.5, 0, 0)}>+</button>
      </div>
    </div>,
    document.body,
  );
}
