import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="panel prose">
      <h1>Sobre a Y3D</h1>
      <p className="lead">
        Somos uma plataforma criada para conectar criadores, artistas e entusiastas do mundo 3D. Aqui você encontra
        modelos exclusivos, de alta qualidade e com suporte completo — do arquivo digital até a impressão em suas mãos.
      </p>
      <div className="grid-3">
        <div><h3>🎨 Modelagem</h3><p>Cada peça nasce de um modelo 3D cuidadosamente criado por nossa equipe de artistas.</p></div>
        <div><h3>🖨️ Impressão</h3><p>Também oferecemos impressão 3D sob encomenda, com diversos materiais e cores.</p></div>
        <div><h3>📦 Entrega</h3><p>Modelos digitais com download imediato; peças físicas embaladas com cuidado.</p></div>
      </div>
      <Link to="/loja/produtos" className="btn btn-primary">Explorar loja →</Link>
    </div>
  );
}
