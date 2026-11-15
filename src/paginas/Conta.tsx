import { useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import type { UsuarioPublico } from "../../shared/tipos";
import { api, mensagemDeErro } from "../api";
import { Icone } from "../componentes/Icone";
import { useAvisos } from "../contextos/Avisos";
import { useSessao } from "../contextos/Sessao";
import { useTitulo } from "../estilos";
import { dataCurta, fotoUrl, hora, iniciais } from "../formatar";

export function PaginaConta() {
  useTitulo("Minha conta");
  const { usuario: u, carregando, definirUsuario, sair } = useSessao();
  const { avisar } = useAvisos();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const detalhes = useRef<HTMLDetailsElement>(null);

  if (carregando) return null;
  if (!u) return <Navigate to="/login" replace />;

  const trocarFoto = async (arquivo: File | undefined) => {
    if (!arquivo) return;
    if (arquivo.size > 2 * 1024 * 1024) return avisar("A foto é grande demais (máximo 2 MB).");
    try {
      const r = await api<{ usuario: UsuarioPublico }>("/conta/foto", { bruto: { dados: arquivo, tipo: arquivo.type } });
      definirUsuario(r.usuario);
      avisar("Foto atualizada com sucesso!");
    } catch (err) {
      avisar(mensagemDeErro(err));
    }
  };

  const salvarNome = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const r = await api<{ usuario: UsuarioPublico }>("/conta/nome", { metodo: "PATCH", corpo: { nome } });
      definirUsuario(r.usuario);
      avisar("Nome atualizado com sucesso!");
      if (detalhes.current) detalhes.current.open = false;
    } catch (err) {
      avisar(mensagemDeErro(err));
    }
  };

  const deslogar = async () => {
    await sair();
    avisar("Você saiu da sua conta.");
    navigate("/");
  };

  return (
    <>
      <div className="crumbs"><Link to="/">Início</Link> / Minha conta</div>

      <section className="acc">
        <aside className="acc-side card-panel">
          <div className="acc-avatar">
            {u.foto ? <img src={fotoUrl(u.foto)} alt={`Foto de ${u.nome}`} referrerPolicy="no-referrer" /> : iniciais(u.nome)}
          </div>
          <div className="acc-photo-form">
            <input type="file" id="acc-foto" accept="image/jpeg,image/png,image/webp" hidden
              onChange={(e) => { void trocarFoto(e.target.files?.[0]); e.target.value = ""; }} />
            <label htmlFor="acc-foto" className="btn btn-outline btn-sm acc-photo-btn">📷 Trocar foto</label>
          </div>
          <h1>{u.nome}</h1>
          <details className="acc-edit" ref={detalhes} onToggle={(e) => { if (e.currentTarget.open) setNome(u.nome); }}>
            <summary className="btn btn-outline btn-sm">✏️ Editar nome</summary>
            <form className="acc-edit-form" onSubmit={(e) => void salvarNome(e)}>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} minLength={2} maxLength={80} required aria-label="Novo nome" />
              <button type="submit" className="btn btn-grad btn-sm">Salvar</button>
            </form>
          </details>
          <p className="acc-mail">{u.email}</p>
          <span className="acc-badge"><i></i> Conectado</span>
          <div className="acc-actions">
            <Link to="/produtos" className="btn btn-grad btn-block">Continuar comprando</Link>
            <Link to="/carrinho" className="btn btn-outline btn-block">Ver carrinho</Link>
            <button type="button" className="btn btn-outline btn-block acc-out" onClick={() => void deslogar()}>Sair da conta</button>
          </div>
        </aside>

        <div className="acc-main card-panel">
          <div className="sec-h"><h2>Dados da conta</h2></div>
          <dl className="acc-list">
            <div className="acc-item"><span className="acc-ic"><Icone nome="contaNome" /></span><div><dt>Nome</dt><dd>{u.nome}</dd></div></div>
            <div className="acc-item"><span className="acc-ic"><Icone nome="contaEmail" /></span><div><dt>E-mail</dt><dd>{u.email}</dd></div></div>
            <div className="acc-item"><span className="acc-ic"><Icone nome="contaSenha" /></span><div><dt>Senha</dt><dd className="acc-pass">{"•".repeat(10)}</dd></div></div>
            <div className="acc-item"><span className="acc-ic"><Icone nome="contaData" /></span><div><dt>Login realizado em</dt><dd>{dataCurta(u.loginEm)} às {hora(u.loginEm)}</dd></div></div>
          </dl>
          <p className="acc-note">Por segurança, a senha aparece mascarada: sites de verdade nunca guardam nem mostram a senha original, só uma versão criptografada.</p>
        </div>
      </section>
    </>
  );
}
