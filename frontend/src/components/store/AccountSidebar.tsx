import { ChangeEvent, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useStoredState } from "../../hooks/useStoredState";
import { iniciais } from "../../utils/format";
import { HeartIcon, LogoutIcon, PackageIcon, UserIcon } from "./Icons";

const ITENS = [
  { to: "/loja/conta", texto: "Meus pedidos", icone: <PackageIcon size={18} />, end: true },
  { to: "/loja/conta/perfil", texto: "Meu perfil", icone: <UserIcon size={18} />, end: false },
  { to: "/loja/conta/favoritos", texto: "Favoritos", icone: <HeartIcon size={18} />, end: false },
];

/** Reduz a foto escolhida para no máximo 256px e devolve em JPEG (cabe folgado no localStorage). */
function reduzirFoto(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      const lado = 256;
      const canvas = document.createElement("canvas");
      canvas.width = lado;
      canvas.height = lado;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas indisponível"));
      const corte = Math.min(img.width, img.height); // recorte quadrado centralizado
      ctx.drawImage(img, (img.width - corte) / 2, (img.height - corte) / 2, corte, corte, 0, 0, lado, lado);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("imagem inválida"));
    img.src = url;
  });
}

/** Menu lateral da conta: avatar, nome, e-mail e navegação. */
export function AccountSidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const inputFoto = useRef<HTMLInputElement>(null);
  const [foto, setFoto] = useStoredState<string | null>(`y3d_foto_${usuario?.id ?? 0}`, null);
  if (!usuario) return null;

  const trocarFoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo || !arquivo.type.startsWith("image/")) return;
    try {
      setFoto(await reduzirFoto(arquivo));
    } catch {
      /* arquivo que não é uma imagem válida: ignora */
    }
  };

  const sair = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="panel account-side">
      <div className="account-user">
        <span className="avatar big">{foto ? <img src={foto} alt={`Foto de ${usuario.nome}`} /> : iniciais(usuario.nome)}</span>
        <div>
          <strong>{usuario.nome}</strong>
          <small>{usuario.email}</small>
        </div>
      </div>
      <div className="account-edit">
        <input ref={inputFoto} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={trocarFoto} />
        <button type="button" className="acc-link" onClick={() => inputFoto.current?.click()}>📷 Trocar foto</button>
        <NavLink to="/loja/conta/perfil" className="acc-link">✏️ Editar nome</NavLink>
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
