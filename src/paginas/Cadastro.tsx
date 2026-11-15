import { Link, Navigate } from "react-router-dom";
import { ArteLogin, FormCadastro } from "../componentes/FormulariosConta";
import { Icone } from "../componentes/Icone";
import { useSessao } from "../contextos/Sessao";
import { useTitulo } from "../estilos";

export function PaginaCadastro() {
  useTitulo("Criar conta");
  const { usuario, carregando } = useSessao();
  if (!carregando && usuario) return <Navigate to="/conta" replace />;
  return (
    <div className="lg-page">
      <section className="lg-art" aria-label="Oficina Y3D com impressora 3D e peças impressas">
        <Link to="/" className="lg-back"><Icone nome="voltar" />Voltar à loja</Link>
        <ArteLogin />
      </section>
      <section className="lg-side">
        <div className="lg-card"><FormCadastro /></div>
      </section>
    </div>
  );
}
