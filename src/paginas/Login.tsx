import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { api, mensagemDeErro } from "../api";
import { AlertaForm, ArteLogin, CampoSenha, CampoTexto, FormLogin, MarcaFormulario } from "../componentes/FormulariosConta";
import { Icone } from "../componentes/Icone";
import { useSessao } from "../contextos/Sessao";
import { useTitulo } from "../estilos";

const caixaSucesso = { borderColor: "#3ddbf2", background: "rgba(61,219,242,.1)", color: "#d8faff" };

function Recuperar() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    try {
      await api("/auth/recuperar", { corpo: { email } });
      setSucesso(true);
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };
  return (
    <>
      <MarcaFormulario />
      <h1>Recuperar <span>senha</span></h1>
      <p className="lg-sub">Informe o e-mail da sua conta. Se ele estiver cadastrado e o serviço de envio estiver disponível, enviaremos um link válido por uma hora.</p>
      {erro && <AlertaForm>{erro}</AlertaForm>}
      {sucesso ? (
        <div className="lg-alert" role="status" style={caixaSucesso}>Se houver uma conta com esse e-mail, enviaremos as instruções. Verifique também a caixa de spam.</div>
      ) : (
        <form onSubmit={(e) => void enviar(e)} noValidate>
          <CampoTexto icone="email" tipo="email" nome="email" placeholder="Digite seu e-mail" autoComplete="email" rotulo="E-mail" valor={email} aoMudar={setEmail} />
          <button type="submit" className="lg-btn">Enviar link de recuperação</button>
        </form>
      )}
      <p className="lg-signup"><Link to="/login">Voltar para o login</Link></p>
    </>
  );
}

function Redefinir({ token }: { token: string }) {
  const [valido, setValido] = useState<boolean | null>(null);
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    api<{ valido: boolean }>(`/auth/token/${encodeURIComponent(token)}`).then((r) => setValido(r.valido)).catch(() => setValido(false));
  }, [token]);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    try {
      await api("/auth/redefinir", { corpo: { token, senha, confirma } });
      setSucesso(true);
      setValido(false);
    } catch (err) {
      setErro(mensagemDeErro(err));
      if ((err as { dados?: { linkInvalido?: boolean } }).dados?.linkInvalido) setValido(false);
    }
  };

  return (
    <>
      <MarcaFormulario />
      <h1>Nova <span>senha</span></h1>
      <p className="lg-sub">Escolha uma nova senha com pelo menos 6 caracteres.</p>
      {erro && <AlertaForm>{erro}</AlertaForm>}
      {sucesso ? (
        <>
          <div className="lg-alert" role="status" style={caixaSucesso}>Senha alterada com sucesso. Você já pode entrar com a nova senha.</div>
          <p className="lg-signup"><Link to="/login">Ir para o login</Link></p>
        </>
      ) : valido ? (
        <form onSubmit={(e) => void salvar(e)} noValidate>
          <CampoSenha icone="cadeadoNovo" id="nova-senha" nome="senha" placeholder="Nova senha (mín. 6 caracteres)" autoComplete="new-password" rotulo="Nova senha" valor={senha} aoMudar={setSenha} minLength={6} olho={false} />
          <CampoSenha icone="cadeadoNovo" id="nova-confirma" nome="confirma" placeholder="Confirme a nova senha" autoComplete="new-password" rotulo="Confirmar nova senha" valor={confirma} aoMudar={setConfirma} minLength={6} olho={false} />
          <button type="submit" className="lg-btn">Salvar nova senha</button>
        </form>
      ) : valido === null ? null : (
        <>
          {!erro && <div className="lg-alert" role="alert">Este link é inválido ou expirou. Solicite uma nova redefinição.</div>}
          <p className="lg-signup"><Link to="/login?acao=recuperar">Solicitar novo link</Link></p>
        </>
      )}
    </>
  );
}

export function PaginaLogin() {
  useTitulo("Entrar");
  const { usuario, carregando } = useSessao();
  const [params] = useSearchParams();
  const acao = params.get("acao");
  if (!carregando && usuario) return <Navigate to="/conta" replace />;
  return (
    <div className="lg-page">
      <section className="lg-art" aria-label="Oficina Y3D com impressora 3D e peças impressas">
        <Link to="/" className="lg-back"><Icone nome="voltar" />Voltar à loja</Link>
        <ArteLogin />
      </section>
      <section className="lg-side">
        <div className="lg-card">
          {acao === "recuperar" ? <Recuperar /> : acao === "redefinir" ? <Redefinir token={params.get("token") ?? ""} /> : <FormLogin prefixo="lg" />}
        </div>
      </section>
    </div>
  );
}
