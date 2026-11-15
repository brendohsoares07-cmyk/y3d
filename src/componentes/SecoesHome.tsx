import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdicionarAoCarrinho, srcImagem } from "./CartaoProduto";
import { useCarrinho } from "../contextos/Carrinho";
import { useCatalogo } from "../contextos/Catalogo";
import { formatarNumeroPreco, formatarPreco } from "../formatar";

const LOGO = "/assets/img/logo-y3d-transparente.png";

// ---------- SOBRE (logo abaixo do vídeo de abertura) ----------

const PASSOS: [string, string][] = [
  ["Escolha seu modelo 3D", "Navegue pelo nosso catálogo e encontre o objeto que deseja produzir. Você pode visualizar o modelo digital e conhecer seus detalhes antes de fazer o pedido."],
  ["Faça seu pedido pelo site", "Depois de escolher o modelo, solicite a impressão diretamente pela plataforma, selecionando as opções disponíveis para o produto."],
  ["Transformamos o modelo em realidade", "Nossa equipe utiliza impressoras 3D para fabricar o objeto escolhido, construindo a peça camada por camada, de acordo com o projeto digital."],
  ["Seu projeto ganha forma", "O que antes era apenas uma imagem na tela se transforma em um produto físico, pronto para ser utilizado, exposto ou fazer parte de um novo projeto."],
];
const DIFERENCIAIS: [string, string][] = [
  ["Mais criatividade", '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.9.7 1.5 1.6 1.5 2.6V17h4v-.5c0-1 .6-1.9 1.5-2.6A6 6 0 0 0 12 3z"/>'],
  ["Personalização", '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.6-3.6 3.4-5.5 7-5.5s6.4 1.9 7 5.5z"/>'],
  ["Tecnologia de ponta", '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>'],
  ["Sustentabilidade", '<path d="M20 4C10 4 5 9 5 15c0 2 .8 3.6 2 5 1.4 1.2 3 2 5 2 6 0 8-8 8-18z"/><path d="M5 20c3-5 6-8 11-11"/>'],
];
const DRAGAO = "/assets/img/produtos/dragao-preto.jpg";

export function SobreHome() {
  return (
    <section className="sec sobre-home" id="sobre">
      <div className="sh-intro">
        <div className="sh-intro-copy">
          <span className="sh-eyebrow">SOBRE A</span>
          <img className="sh-logo" src={LOGO} alt="Y3D Creations" />
          <h2 className="sh-title">Da sua ideia para<br /><span className="grad">o mundo real.</span></h2>
          <p>A Y3D nasceu para transformar ideias digitais em objetos reais por meio da tecnologia de impressão 3D. Nosso objetivo é tornar essa tecnologia mais acessível, prática e inovadora, oferecendo uma experiência simples para quem deseja criar produtos personalizados.</p>
          <p>Em nosso site, você pode explorar um catálogo de modelos 3D, visualizar imagens e escolher o projeto que mais combina com sua ideia. Cada modelo funciona como um rascunho digital, mostrando como o produto ficará antes de ser produzido.</p>
        </div>
        <div className="sh-intro-art" aria-hidden="true">
          <div className="sh-monitor">
            <div className="sh-monitor-screen"><img src={DRAGAO} alt="" loading="lazy" /></div>
            <div className="sh-monitor-stand"></div>
          </div>
          <p className="sh-quote">O que hoje é um modelo digital, amanhã pode ser parte da sua realidade.</p>
        </div>
      </div>

      <div className="sh-steps-wrap">
        <span className="sh-eyebrow">COMO FUNCIONA?</span>
        <h3 className="sh-h3">É simples, rápido e <span className="grad">direto.</span></h3>
        <ol className="sh-steps">
          {PASSOS.map(([titulo, texto], i) => (
            <li className="sh-step" key={titulo}>
              <div className={`sh-step-img sh-step-img-${i + 1}`}>
                {i === 0 && <img src={DRAGAO} alt="" loading="lazy" style={{ filter: "grayscale(1) contrast(1.05) brightness(.95)" }} />}
                {i === 1 && (
                  <div className="sh-mock">
                    <img src={DRAGAO} alt="" loading="lazy" style={{ filter: "grayscale(1)" }} />
                    <div className="sh-mock-lines"><i></i><i></i><i></i><span>Comprar</span></div>
                  </div>
                )}
                {i === 2 && <img src="/assets/img/maquinas/impressora-fdm.svg" alt="" loading="lazy" />}
                {i === 3 && <img src={DRAGAO} alt="" loading="lazy" />}
                <b className="sh-num">{i + 1}</b>
              </div>
              <h4>{titulo}</h4>
              <p>{texto}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="sh-tech">
        <div className="sh-tech-main">
          <div className="sh-tech-title">
            <span className="sh-eyebrow">TECNOLOGIA QUE</span>
            <h3>transforma <span className="grad">ideias.</span></h3>
          </div>
          <p>Na <b>Y3D</b>, acreditamos que a impressão 3D vai além de fabricar objetos: ela abre portas para a <b>criatividade</b>, a personalização e novas possibilidades. Unimos inovação e praticidade para aproximar você do futuro da fabricação digital.</p>
          <div className="sh-tech-brand">
            <img src={LOGO} alt="Y3D Creations" />
            <span>Imagine, escolha<br />e transforme.</span>
          </div>
        </div>
        <ul className="sh-feats">
          {DIFERENCIAIS.map(([nome, icone]) => (
            <li key={nome}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icone }} />
              <span>{nome}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------- COMPRAR AGORA (adiciona e vai para o checkout) ----------

function useComprarAgora() {
  const { adicionar } = useCarrinho();
  const navigate = useNavigate();
  return (id: number, quantidade = 1) => {
    adicionar(id, quantidade);
    navigate("/checkout");
  };
}

// ---------- PROMOÇÃO BT21: carrossel com um personagem por vez + faixa da coleção completa ----------

const IDS_BT21 = [18, 19, 20, 21, 22, 23, 24];

export function PromoBt21() {
  const { produtoPorId } = useCatalogo();
  const adicionar = useAdicionarAoCarrinho();
  const comprarAgora = useComprarAgora();
  const personagens = IDS_BT21.map(produtoPorId).filter((p) => !!p);
  const colecao = produtoPorId(25);

  const pista = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [atual, setAtual] = useState(0);
  const atualRef = useRef(0);
  const pausado = useRef(false);
  const total = personagens.length;

  const irPara = useCallback((indice: number) => {
    if (total === 0) return;
    const novo = (indice + total) % total;
    atualRef.current = novo;
    setAtual(novo);
    const card = cards.current[novo];
    const el = pista.current;
    if (!card || !el) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: reduzir ? "auto" : "smooth" });
  }, [total]);

  // se a pessoa arrastar com o dedo/mouse, acompanha qual card ficou no centro
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let aguardando = false;
    const aoRolar = (): void => {
      if (aguardando) return;
      aguardando = true;
      requestAnimationFrame(() => {
        aguardando = false;
        const centro = el.scrollLeft + el.clientWidth / 2;
        let melhor = atualRef.current;
        let menor = Infinity;
        cards.current.forEach((card, i) => {
          if (!card) return;
          const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centro);
          if (d < menor) { menor = d; melhor = i; }
        });
        if (melhor !== atualRef.current) { atualRef.current = melhor; setAtual(melhor); }
      });
    };
    el.addEventListener("scroll", aoRolar);
    return () => el.removeEventListener("scroll", aoRolar);
  }, [total]);

  // avanço automático a cada 4,5 s (pausa com o mouse, foco ou toque)
  useEffect(() => {
    if (total === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => { if (!pausado.current && !document.hidden) irPara(atualRef.current + 1); }, 4500);
    return () => window.clearInterval(id);
  }, [total, irPara]);

  useEffect(() => { if (total > 0) irPara(0); }, [total, irPara]);

  if (total === 0) return null;
  const pausar = (v: boolean) => () => { pausado.current = v; };

  return (
    <section className="sec" id="promo-bt21">
      <div className="bt21" data-bt21 onMouseEnter={pausar(true)} onMouseLeave={pausar(false)} onFocus={pausar(true)} onBlur={pausar(false)} onTouchStart={pausar(true)} onTouchEnd={pausar(false)}>
        <div className="bt21-head">
          <span className="bt21-tag">BT21</span>
          <div>
            <h2>Coleção BT21 em <span className="grad">promoção</span></h2>
            <p className="bt21-sub">Escolha seu personagem favorito</p>
          </div>
          <span className="bt21-line" aria-hidden="true"></span>
        </div>

        <div className="bt21-carrossel">
          <button type="button" className="bt21-seta bt21-seta-esq" aria-label="Personagem anterior" onClick={() => irPara(atual - 1)}>←</button>
          <div className="bt21-pista" ref={pista} tabIndex={0} aria-label="Personagens BT21 em promoção"
            onKeyDown={(e) => { if (e.key === "ArrowLeft") irPara(atual - 1); if (e.key === "ArrowRight") irPara(atual + 1); }}>
            {personagens.map((p, i) => {
              if (!p) return null;
              const nomeCurto = p.nome.replace("BT21", "").trim();
              return (
                <article key={p.id} className={`bt21-card${i === atual ? " ativo" : ""}`} data-nome={nomeCurto} ref={(el) => { cards.current[i] = el; }}>
                  <Link to={`/produto/${p.id}`} className="bt21-palco" style={{ ["--c1" as string]: p.cor1, ["--c2" as string]: p.cor2 }}>
                    <span className="bt21-selo">BT21</span>
                    <img src={srcImagem(p.imagem)} alt={`${nomeCurto} BT21`} loading="lazy" />
                  </Link>
                  <div className="bt21-info">
                    <Link to={`/produto/${p.id}`}><h3>{nomeCurto}</h3></Link>
                    <span className="bt21-traco" aria-hidden="true"></span>
                    <div className="bt21-preco-row">
                      <span className="bt21-preco"><small>R$</small> {formatarNumeroPreco(p.preco)}</span>
                      <button type="button" className="cart-add" aria-label={`Adicionar ${nomeCurto} ao carrinho`} onClick={() => adicionar(p.id)}>🛒</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <button type="button" className="bt21-seta bt21-seta-dir" aria-label="Próximo personagem" onClick={() => irPara(atual + 1)}>→</button>
        </div>

        <div className="bt21-pontos">
          {personagens.map((p, i) => (
            <button key={p?.id ?? i} type="button" className={`bt21-ponto${i === atual ? " on" : ""}`} aria-label={`Ver ${p?.nome.replace("BT21", "").trim() ?? "personagem"}`} onClick={() => irPara(i)} />
          ))}
        </div>
      </div>

      {colecao && (
        <div className="bt21-combo">
          <span className="bt21-tag">BT21</span>
          <img className="bt21-combo-img" src="/assets/img/bt21/colecao-home.jpg" alt="Coleção completa BT21" loading="lazy" />
          <div className="bt21-combo-copy">
            <span className="lg-eyebrow bt21-eyebrow">COLEÇÃO COMPLETA <i>///</i></span>
            <p>7 personagens por <b className="grad">{formatarPreco(colecao.preco)}</b></p>
          </div>
          <button type="button" className="btn btn-grad bt21-comprar" onClick={() => comprarAgora(colecao.id)}>🛒 COMPRAR AGORA →</button>
        </div>
      )}
    </section>
  );
}

// ---------- PROMOÇÃO DOS PERSONAGENS (combo) ----------

const NOMES_PROMO: Record<number, string> = { 26: "Coiote", 27: "Frajola", 28: "Harry Potter", 29: "Bowser" };

export function PromoPersonagens() {
  const { produtoPorId } = useCatalogo();
  const comprarAgora = useComprarAgora();
  const ids = [26, 27, 28, 29];
  const personagens = ids.map(produtoPorId);
  const combo = produtoPorId(30);
  if (!combo || personagens.some((p) => !p)) return null;
  const lista = personagens.filter((p): p is NonNullable<typeof p> => !!p);
  const separado = lista.reduce((s, p) => s + p.preco, 0);
  const economia = separado - combo.preco;
  const desconto = Math.round((economia / separado) * 100);

  return (
    <section className="sec" id="promo-personagens">
      <div className="personagens-promo">
        <header className="personagens-promo-head">
          <span className="personagens-promo-selo">OFERTA IMPERDÍVEL</span>
          <p className="personagens-promo-chamada">4 personagens. Um combo de respeito.</p>
          <h2>Sua coleção completa por <span className="grad">{formatarPreco(combo.preco)}</span></h2>
          <p className="personagens-promo-sub">Coiote, Frajola, Harry Potter e Bowser: leve os quatro e economize {formatarPreco(economia)}!</p>
        </header>
        <div className="personagens-promo-lista">
          {lista.map((p) => (
            <Link key={p.id} className="personagens-promo-item" to={`/produto/${p.id}`}>
              <span className="personagens-promo-foto"><img src={srcImagem(p.imagem)} alt="" loading="lazy" /></span>
              <span className="personagens-promo-nome">{NOMES_PROMO[p.id] ?? p.nome}</span>
              <span className="personagens-promo-preco">{formatarPreco(p.preco)}</span>
            </Link>
          ))}
        </div>
        <div className="personagens-promo-oferta">
          <div className="personagens-promo-economia">
            <span className="personagens-promo-tag">{desconto}% OFF NO COMBO</span>
            <span className="personagens-promo-valores"><s>{formatarPreco(separado)}</s><strong>{formatarPreco(combo.preco)}</strong></span>
            <span className="personagens-promo-economize">Você economiza {formatarPreco(economia)}</span>
          </div>
          <button type="button" className="btn btn-grad personagens-promo-botao" onClick={() => comprarAgora(combo.id)}>🛒 GARANTIR MEU COMBO →</button>
        </div>
      </div>
    </section>
  );
}

// ---------- Faixa da marca e "Nossas máquinas" (página Sobre) ----------

export function FaixaMarca() {
  return (
    <section className="sec">
      <div className="brand-band">
        <img className="brand-logo" src={LOGO} alt="Logo Y3D Creations" loading="lazy" />
        <div className="brand-copy">
          <span className="lg-eyebrow" style={{ color: "var(--cyan)" }}>CONHEÇA A MARCA</span>
          <h2>Y3D <span className="grad">Creations</span></h2>
          <p>Da modelagem à impressão: criamos peças personalizadas, miniaturas, decoração e brindes, sempre com acabamento cuidadoso e a sua ideia no centro.</p>
          <div className="brand-actions">
            <Link to="/produtos" className="btn btn-grad">Explorar loja →</Link>
            <Link to="/sobre" className="btn btn-outline">Sobre nós</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const MAQUINAS: [string, string, string][] = [
  ["impressora-fdm.svg", "Impressora FDM", "Peças resistentes em PLA, PETG e ABS, ótimas para protótipos, suportes e decoração."],
  ["impressora-fechada.svg", "Impressora fechada CoreXY", "Cabine fechada e movimento rápido, para acabamento limpo e materiais mais técnicos."],
  ["impressora-resina.svg", "Impressora de resina", "Detalhes finos para miniaturas, personagens e estatuetas."],
];

export function Maquinas() {
  return (
    <section className="sec">
      <div className="sec-h"><h2>Nossas máquinas</h2><Link className="more" to="/contato">Peça um orçamento →</Link></div>
      <div className="grid g3">
        {MAQUINAS.map(([arquivo, nome, desc]) => (
          <article className="machine" key={arquivo}>
            <img src={`/assets/img/maquinas/${arquivo}`} alt={`Ilustração: ${nome}`} loading="lazy" />
            <div className="machine-body"><h3>{nome}</h3><p>{desc}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
