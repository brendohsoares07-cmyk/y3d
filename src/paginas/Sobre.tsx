import { Link } from "react-router-dom";
import { FaixaMarca, Maquinas } from "../componentes/SecoesHome";
import { useTitulo } from "../estilos";

export function PaginaSobre() {
  useTitulo("Sobre");
  return (
    <>
      <div className="card-panel">
        <div className="grid g2" style={{ alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "clamp(24px,3vw,34px)", margin: "0 0 14px" }}>Sobre a <span className="grad" style={{ background: "var(--grad)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Y3D</span></h1>
            <p style={{ color: "var(--mute)" }}>Somos uma plataforma criada para conectar criadores, artistas e entusiastas do mundo 3D. Aqui você encontra modelos exclusivos, de alta qualidade e com suporte completo — do arquivo digital até a impressão em suas mãos.</p>
            <Link to="/produtos" className="btn btn-grad" style={{ marginTop: 16 }}>Explorar loja →</Link>
          </div>
          <div className="promo" style={{ alignItems: "center", textAlign: "center" }}>
            <div className="promo-art" style={{ margin: 0 }}><img src="/assets/img/logo-y3d-transparente.png" alt="Logo Y3D Creations" /></div>
            <div className="grid g3" style={{ textAlign: "center" }}>
              <div><b style={{ fontSize: 20 }}>+10k</b><br /><span style={{ color: "var(--mute)", fontSize: 12 }}>Modelos disponíveis</span></div>
              <div><b style={{ fontSize: 20 }}>+5k</b><br /><span style={{ color: "var(--mute)", fontSize: 12 }}>Clientes satisfeitos</span></div>
              <div><b style={{ fontSize: 20 }}>99%</b><br /><span style={{ color: "var(--mute)", fontSize: 12 }}>Avaliação positiva</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="sec grid g3">
        <div className="card-panel"><h3 style={{ margin: "0 0 8px" }}>🎨 Modelagem</h3><p style={{ color: "var(--mute)", fontSize: 14 }}>Cada peça nasce de um modelo 3D cuidadosamente criado por nossa equipe de artistas.</p></div>
        <div className="card-panel"><h3 style={{ margin: "0 0 8px" }}>🖨️ Impressão</h3><p style={{ color: "var(--mute)", fontSize: 14 }}>Também oferecemos impressão 3D sob encomenda, com diversos materiais e cores.</p></div>
        <div className="card-panel"><h3 style={{ margin: "0 0 8px" }}>📦 Entrega</h3><p style={{ color: "var(--mute)", fontSize: 14 }}>Modelos digitais com download imediato; peças físicas embaladas com cuidado.</p></div>
      </div>

      <FaixaMarca />
      <Maquinas />
    </>
  );
}
