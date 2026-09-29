import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { iniciais } from "../../utils/format";
import { HeartIcon, LogoutIcon, PackageIcon, UserIcon } from "./Icons";

const ITENS = [
  { to: "/loja/conta", texto: "Meus pedidos", icone: <PackageIcon size={18} />, end: true },
  { to: "/loja/conta/perfil", texto: "Meu perfil", icone: <UserIcon size={18} />, end: false },
  { to: "/loja/conta/favoritos", texto: "Favoritos", icone: <HeartIcon size={18} />, end: false },
];

/** Menu lateral da conta: avatar, nome, e-mail e navegação. */
export function AccountSidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  if (!usuario) return null;

  const sair = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="panel account-side">
      <div className="account-user">
        <span className="avatar big">{iniciais(usuario.nome)}</span>
        <div>
          <strong>{usuario.nome}</strong>
          <small>{usuario.email}</small>
        </div>
      </div>
      <nav>
        {ITENS.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => (isActive ? "acc-link on" : "acc-link")}>
            {i.icone} {i.texto}
          </NavLink>
        ))}
        <button type="button" className="acc-link" onClick={sair}><LogoutIcon size={18} /> Sair</button>
      </nav>
    </aside>
  );
}
