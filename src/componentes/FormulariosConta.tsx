import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UsuarioPublico } from "../../shared/tipos";
import { api, mensagemDeErro } from "../api";
import { useAvisos } from "../contextos/Avisos";
import { useSessao } from "../contextos/Sessao";
import { Icone } from "./Icone";
import type { NomeIcone } from "../icones";

const LOGO = "/assets/img/logo-y3d-transparente.png";

export function MarcaFormulario() {
  return (
    <div className="lg-brand">
      <div className="lg-logo"><img src={LOGO} alt="Y3D Creations" /></div>
      <small>IDEIAS GANHAM FORMA</small>
    </div>
  );
}

export function CampoTexto(props: { icone: NomeIcone; tipo: string; id?: string; nome: string; placeholder: string; autoComplete: string; rotulo: string; valor: string; aoMudar: (v: string) => void; minLength?: number }) {
  return (
    <div className="lg-input">
      <Icone nome={props.icone} />
      <input type={props.tipo} id={props.id} name={props.nome} placeholder={props.placeholder} autoComplete={props.autoComplete}
        aria-label={props.rotulo} value={props.valor} onChange={(e) => props.aoMudar(e.target.value)} minLength={props.minLength} required />
    </div>
  );
}

export function CampoSenha(props: { icone: NomeIcone; id: string; nome: string; placeholder: string; autoComplete: string; rotulo: string; valor: string; aoMudar: (v: string) => void; minLength?: number; olho?: boolean }) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="lg-input">
      <Icone nome={props.icone} />
      <input type={visivel ? "text" : "password"} id={props.id} name={props.nome} placeholder={props.placeholder} autoComplete={props.autoComplete}
        aria-label={props.rotulo} value={props.valor} onChange={(e) => props.aoMudar(e.target.value)} minLength={props.minLength} required />
      {props.olho !== false && (
        <button type="button" className="lg-eye" aria-pressed={visivel} aria-label={visivel ? "Ocultar senha" : "Mostrar senha"} onClick={() => setVisivel(!visivel)}>
          <Icone nome="olhoAberto" className="on" />
          <Icone nome="olhoFechado" className="off" />
        </button>
      )}
    </div>
  );
}

export const AlertaForm = ({ children }: { children: ReactNode }) => <div className="lg-alert" role="alert">{children}</div>;

export function FormLogin({ prefixo }: { prefixo: string }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { definirUsuario } = useSessao();
  const { avisar } = useAvisos();
  const navigate = useNavigate();

  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const r = await api<{ usuario: UsuarioPublico; destino: string }>("/auth/login", { corpo: { email, senha } });
      definirUsuario(r.usuario);
      avisar("Login realizado com sucesso!");
      navigate(r.destino);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <MarcaFormulario />
      <h1>Faça seu <span>login</span></h1>
      <p className="lg-sub">Acesse sua conta e continue explorando nossos produtos 3D.</p>
      {erro && <AlertaForm>{erro}</AlertaForm>}
      <form onSubmit={(e) => void entrar(e)} noValidate>
        <CampoTexto icone="usuario" tipo="email" id={`${prefixo}-email`} nome="email" placeholder="Digite seu e-mail" autoComplete="email" rotulo="E-mail" valor={email} aoMudar={setEmail} />
        <CampoSenha icone="cadeadoCampo" id={`${prefixo}-senha`} nome="senha" placeholder="Digite sua senha" autoComplete="current-password" rotulo="Senha" valor={senha} aoMudar={setSenha} />
        <div className="lg-row">
          <label className="lg-chk">
            <input type="checkbox" name="lembrar" defaultChecked />
            <i><Icone nome="marca" /></i>
            Lembrar de mim
          </label>
          <Link to="/login?acao=recuperar" className="lg-link">Esqueceu sua senha?</Link>
        </div>
        <button type="submit" className="lg-btn" disabled={enviando}>
          <Icone nome="entrar" />
          Entrar
        </button>
      </form>
      <p className="lg-signup">Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </>
  );
}

export function FormCadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { definirUsuario } = useSessao();
  const { avisar } = useAvisos();
  const navigate = useNavigate();

  const cadastrar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const r = await api<{ usuario: UsuarioPublico }>("/auth/cadastro", { corpo: { nome, email, senha, confirma } });
      definirUsuario(r.usuario);
      avisar("Conta criada! Bem-vindo(a) à Y3D Creations.");
      navigate("/conta");
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <MarcaFormulario />
      <h1>Crie sua <span>conta</span></h1>
      <p className="lg-sub">Cadastre-se para comprar, favoritar produtos e acompanhar seus pedidos.</p>
      {erro && <AlertaForm>{erro}</AlertaForm>}
      <form onSubmit={(e) => void cadastrar(e)} noValidate>
        <CampoTexto icone="usuarioAlt" tipo="text" id="cad-nome" nome="nome" placeholder="Digite seu nome" autoComplete="name" rotulo="Nome" valor={nome} aoMudar={setNome} />
        <CampoTexto icone="usuario2" tipo="email" id="cad-email" nome="email" placeholder="Digite seu e-mail" autoComplete="email" rotulo="E-mail" valor={email} aoMudar={setEmail} />
        <CampoSenha icone="cadeadoCampo2" id="cad-senha" nome="senha" placeholder="Crie uma senha (mín. 6 caracteres)" autoComplete="new-password" rotulo="Senha" valor={senha} aoMudar={setSenha} minLength={6} />
        <CampoSenha icone="cadeadoCampo2" id="cad-confirma" nome="confirma" placeholder="Confirme sua senha" autoComplete="new-password" rotulo="Confirmar senha" valor={confirma} aoMudar={setConfirma} minLength={6} />
        <button type="submit" className="lg-btn" disabled={enviando}>
          <Icone nome="entrar" />
          Cadastrar
        </button>
      </form>
      <p className="lg-signup">Já tem uma conta? <Link to="/login">Entrar</Link></p>
    </>
  );
}

export function ArteLogin() {
  return (
    <div className="lg-copy">
      <span className="lg-eyebrow">BEM-VINDO À Y3D</span>
      <h2>SUA IDEIA,<br /><em>EM 3D</em></h2>
      <p>Produtos personalizados, criados com tecnologia de ponta e impressos em 3D com alta qualidade.</p>
      <div className="lg-rule"></div>
      <ul className="lg-feats">
        <li><Icone nome="cubo" /><span>Produtos<br />Personalizados</span></li>
        <li><Icone nome="escudoArte" /><span>Alta<br />Qualidade</span></li>
        <li><Icone nome="raioArte" /><span>Entrega<br />Rápida</span></li>
      </ul>
    </div>
  );
}
