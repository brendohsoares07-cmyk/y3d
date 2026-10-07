import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { iniciais } from "../../utils/format";
import { Button } from "../ui/Button";

const LINKS = [
  { to: "/dashboard", texto: "Início" },
  { to: "/produtos", texto: "Produtos" },
  { to: "/categorias", texto: "Categorias" },
  { to: "/maquinas", texto: "Máquinas" },
  { to: "/pedidos", texto: "Pedidos" },
  { to: "/perfil", texto: "Meu perfil" },
];

function NavItem({ to, texto }: { to: string; texto: string }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "nav-link on" : "nav-link")}>
      {texto}
    </NavLink>
  );
}

/** Estrutura da área logada: menu lateral + topo com o usuário + conteúdo da página. */
export function AppLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const sair = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo-icon.svg" alt="" width={36} height={36} />
          <span>
            <strong className="grad">Y3D</strong> Creations
          </span>
        </div>
        <nav>
          <Link to="/loja" className="nav-link">← Voltar à loja</Link>
          {LINKS.map((l) => (
            <NavItem key={l.to} to={l.to} texto={l.texto} />
          ))}
          {usuario?.admin && (
            <>
              <span className="nav-section">Administração</span>
              <NavItem to="/admin" texto="Painel admin" />
            </>
          )}
        </nav>
      </aside>
      <div className="main">
        <div className="topbar">
          <span className="avatar">{usuario ? iniciais(usuario.nome) : ""}</span>
          <span>{usuario?.nome}</span>
          <Button variant="outline" onClick={sair}>
            Sair
          </Button>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
