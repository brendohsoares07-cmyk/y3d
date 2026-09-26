import { FormEvent, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { CartProvider, useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { FavoritesProvider } from "../../context/FavoritesContext";
import { CartIcon, SearchIcon, UserIcon } from "../store/Icons";
import "../../pages/store/store.css";

const LINKS = [
  { to: "/loja", texto: "Início", end: true },
  { to: "/loja/produtos", texto: "Produtos", end: false },
  { to: "/loja/sobre", texto: "Sobre", end: false },
  { to: "/loja/contato", texto: "Contato", end: false },
];

function SearchBox() {
  const navigate = useNavigate();
  const [termo, setTermo] = useState("");

  const buscar = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/loja/produtos${termo.trim() ? `?q=${encodeURIComponent(termo.trim())}` : ""}`);
  };

  return (
    <form className="store-search" onSubmit={buscar} role="search">
      <input value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Buscar produtos" aria-label="Buscar produtos" />
      <button type="submit" aria-label="Buscar"><SearchIcon /></button>
    </form>
  );
}

function Navbar() {
  const { usuario } = useAuth();
  const { totalItens } = useCart();

  return (
    <header className="store-nav">
      <Link to="/loja" className="store-brand">
        <img src="/logo-icon.svg" alt="" width={40} height={40} />
        <span>Y3D <b>creations</b></span>
      </Link>
      <nav className="store-links">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "on" : "")}>
            {l.texto}
          </NavLink>
        ))}
      </nav>
      <div className="store-actions">
        <SearchBox />
        {usuario?.admin && <Link to="/admin" className="store-manage">Painel admin</Link>}
        <Link to="/dashboard" className="store-manage">Gestão</Link>
        <Link to="/loja/conta" className="icon-btn" aria-label="Minha conta" title={usuario?.nome}>
          <UserIcon />
        </Link>
        <Link to="/loja/checkout" className="icon-btn" aria-label={`Carrinho com ${totalItens} itens`}>
          <CartIcon />
          {totalItens > 0 && <span className="cart-badge">{totalItens}</span>}
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="store-footer">
      <span>© Y3D Creations — modelos e peças impressas em 3D</span>
      <span><Link to="/loja/sobre">Sobre</Link> · <Link to="/loja/contato">Contato</Link></span>
    </footer>
  );
}

/** Estrutura da loja: barra de navegação, conteúdo da página e rodapé. Carrinho e favoritos são por usuário. */
export function StoreLayout() {
  const { usuario } = useAuth();
  if (!usuario) return null;

  return (
    <CartProvider key={usuario.id} usuarioId={usuario.id}>
      <FavoritesProvider key={usuario.id} usuarioId={usuario.id}>
        <div className="store">
          <Navbar />
          <main className="store-main">
            <Outlet />
          </main>
          <Footer />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}
