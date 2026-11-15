import { Link } from "react-router-dom";

const maquinas = [
  { imagem: "/assets/img/maquinas/impressora-fdm.svg", nome: "Impressora FDM", texto: "Peças resistentes em PLA, PETG e ABS, ótimas para protótipos, suportes e decoração." },
  { imagem: "/assets/img/maquinas/impressora-fechada.svg", nome: "Impressora fechada CoreXY", texto: "Cabine fechada e movimento rápido, para acabamento limpo e materiais mais técnicos." },
  { imagem: "/assets/img/maquinas/impressora-resina.svg", nome: "Impressora de resina", texto: "Detalhes finos para miniaturas, personagens e estatuetas." },
];
const passos = [
  ["Escolha seu modelo 3D", "Navegue pelo catálogo e encontre o objeto que deseja produzir. Veja as imagens e os detalhes antes de fazer o pedido."],
  ["Faça seu pedido pelo site", "Solicite a impressão pela plataforma e escolha as opções disponíveis para o produto."],
  ["Transformamos o modelo em realidade", "Nossa equipe utiliza impressoras 3D para fabricar o objeto escolhido, construindo a peça camada por camada."],
  ["Seu projeto ganha forma", "O modelo digital se transforma em um produto físico, pronto para ser utilizado, exposto ou fazer parte de um novo projeto."],
];
export function AboutPage() {
  return <div className="about-page">
    <section className="panel about-intro"><img src="/assets/img/logo-y3d-transparente.png" alt="Y3D Creations"/><div><small>CONHEÇA A MARCA</small><h1>Y3D <span className="grad">Creations</span></h1><p className="lead">Da modelagem à impressão: criamos peças personalizadas, miniaturas, decoração e brindes, sempre com acabamento cuidadoso e a sua ideia no centro.</p><p>A Y3D nasceu para transformar ideias digitais em objetos reais por meio da tecnologia de impressão 3D. Nosso objetivo é tornar essa tecnologia mais acessível, prática e inovadora, oferecendo uma experiência simples para quem deseja criar produtos personalizados.</p><Link to="/loja/produtos" className="btn btn-primary">Explorar loja →</Link></div></section>
    <section className="panel"><small className="eyebrow">COMO FUNCIONA?</small><h2>É simples, rápido e <span className="grad">direto.</span></h2><div className="about-steps">{passos.map(([titulo,texto],i)=><article key={titulo}><b>{i+1}</b><h3>{titulo}</h3><p>{texto}</p></article>)}</div></section>
    <section><div className="section-heading"><h2>Nossas máquinas</h2><Link to="/loja/contato">Peça um orçamento →</Link></div><div className="about-machines">{maquinas.map(m=><article className="panel" key={m.nome}><img src={m.imagem} alt={m.nome}/><h3>{m.nome}</h3><p>{m.texto}</p></article>)}</div></section>
    <section className="panel about-tech"><h2>Tecnologia que transforma <span className="grad">ideias.</span></h2><p>Na Y3D, acreditamos que a impressão 3D vai além de fabricar objetos: ela abre portas para a criatividade, a personalização e novas possibilidades. Unimos inovação e praticidade para aproximar você do futuro da fabricação digital.</p><div className="about-differentials"><span>✨ Mais criatividade</span><span>🎨 Personalização</span><span>🖨️ Tecnologia</span><span>♻️ Sustentabilidade</span></div></section>
  </div>;
}
