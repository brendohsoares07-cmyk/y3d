import { FormEvent, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { CartProvider, useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { FavoritesProvider, useFavorites } from "../../contexts/FavoritesContext";
import { CartIcon, UserIcon } from "../store/Icons";
import "../../styles/store.css";
import "../../styles/legacy-store.css";

const LINKS = [
  { to: "/loja", texto: "Início", end: true },
  { to: "/loja/produtos", texto: "Produtos", end: false },
  { to: "/loja/contato", texto: "Contato", end: false },
];

function SearchBox() {
  const navigate = useNavigate(); const [termo, setTermo] = useState("");
  const buscar = (e: FormEvent) => { e.preventDefault(); navigate(`/loja/produtos${termo.trim() ? `?q=${encodeURIComponent(termo.trim())}` : ""}`); };
  return <form className="hdr-search" onSubmit={buscar} role="search"><span aria-hidden="true">⌕</span><input value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Buscar produtos, modelos ou categorias..." aria-label="Buscar produtos" /></form>;
}

function Navbar() {
  const { usuario, logout } = useAuth(); const { totalItens } = useCart(); const { ids } = useFavorites();
  return <header className="hdr"><div className="hdr-in">
    <Link to="/loja" className="logo"><img src="/assets/img/logo-y3d-transparente.png" className="logo-ic" alt="Y3D Creations" /></Link>
    <nav className="hdr-nav">{LINKS.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={({isActive}) => isActive ? "on" : ""}>{link.texto}</NavLink>)}<Link to="/loja/sobre">Sobre</Link></nav>
    <SearchBox />
    <div className="hdr-icons">
      <Link to={usuario ? "/loja/conta" : "/login"} className="ibtn" title="Minha conta" aria-label="Minha conta"><UserIcon /></Link>
      <Link to={usuario ? "/loja/conta/favoritos" : "/login?returnTo=%2Floja%2Fconta%2Ffavoritos"} className="ibtn" title="Favoritos" aria-label="Favoritos">♡{ids.length > 0 && <span className="n">{ids.length}</span>}</Link>
      <Link to="/loja/carrinho" className="ibtn" title="Carrinho" aria-label={`Carrinho com ${totalItens} itens`}><CartIcon />{totalItens > 0 && <span className="n">{totalItens}</span>}</Link>
      {usuario?.admin && <Link to="/admin" className="btn btn-outline btn-sm">Admin</Link>}
      {usuario ? <><Link to="/loja/conta" className="ava" title={usuario.nome}>{usuario.foto ? <img src={usuario.foto} alt=""/> : usuario.nome.slice(0,1).toUpperCase()}</Link><button className="btn btn-grad btn-sm" type="button" onClick={logout}>Sair</button></> : <Link to="/login" className="btn btn-grad btn-sm">Entrar</Link>}
    </div>
  </div></header>;
}

function Footer() {
  return <footer className="ftr"><div className="wrap"><div className="ftr-main">
    <div className="ftr-brand"><Link to="/loja" className="ftr-logo"><img src="/assets/img/logo-y3d-transparente.png" alt="Y3D Creations" /></Link><p>Transformando ideias em realidade com tecnologia, inovação e qualidade. Sua loja de produtos e soluções em impressão 3D.</p></div>
    <nav className="ftr-col"><h4>Navegação</h4><ul className="ftr-nav"><li><Link to="/loja">Início</Link></li><li><Link to="/loja/produtos">Produtos</Link></li><li><Link to="/loja/sobre">Sobre nós</Link></li><li><Link to="/loja/contato">Contato</Link></li></ul></nav>
    <div className="ftr-col"><h4>Redes sociais</h4><p className="ftr-sub">Siga a Y3D e fale com a gente.</p><div className="ftr-social"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a><a href="https://wa.me/554499638985" target="_blank" rel="noreferrer" aria-label="WhatsApp">◉</a></div></div>
    <div className="ftr-col"><h4>Formas de pagamento</h4><p className="ftr-sub">Compre com total segurança.</p><div className="ftr-pay"><span className="pay-visa">VISA</span><span className="pay-elo">elo</span><span className="pay-pix">PIX</span><span className="pay-mc">●●</span></div><div className="ftr-boleto">▥ Boleto bancário</div></div>
    <div className="ftr-col"><h4>Entrega</h4><p className="ftr-sub">Enviamos para todo o Brasil.</p><ul className="ftr-feat"><li><b>Frete seguro</b> para todo o país</li><li><b>Entrega expressa</b> (consulte regiões)</li><li><b>Rastreie seu pedido</b> pelo atendimento</li></ul></div>
    <div className="ftr-col"><h4>Compra segura</h4><p className="ftr-sub">Seus dados protegidos.</p><ul className="ftr-feat"><li><b>Ambiente seguro</b> em todas as etapas</li><li><b>Privacidade</b> dos seus dados</li></ul></div>
  </div><div className="ftr-bottom"><span>© 2026 Y3D Creations — Projeto acadêmico. Todos os direitos reservados.</span><div className="ftr-end"><span>Impressão 3D é <b>o futuro.</b></span><span className="ftr-line"/><img src="/assets/img/logo-y3d-transparente.png" alt="Y3D"/></div></div></div></footer>;
}

export function StoreLayout() {
  const { usuario } = useAuth(); const chave = usuario?.id ?? "convidado";
  return <CartProvider key={chave} usuarioId={chave}><FavoritesProvider key={chave} usuarioId={chave}><div className="store"><Navbar/><main className="wrap store-main"><Outlet/></main><Footer/></div></FavoritesProvider></CartProvider>;
}
