import { Link } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";

const ATALHOS = [
  { to: "/produtos", titulo: "Produtos", texto: "Catálogo de peças e modelos 3D" },
  { to: "/categorias", titulo: "Categorias", texto: "Organize o catálogo por tipo" },
  { to: "/maquinas", titulo: "Máquinas", texto: "Impressoras 3D da oficina" },
  { to: "/pedidos", titulo: "Pedidos", texto: "Acompanhe as vendas" },
];

function AtalhoCard({ to, titulo, texto }: { to: string; titulo: string; texto: string }) {
  return (
    <Link to={to} className="card shortcut">
      <h2>{titulo}</h2>
      <p className="muted">{texto}</p>
    </Link>
  );
}

export function DashboardPage() {
  const { usuario } = useAuth();
  return (
    <>
      <PageHeader titulo={`Olá, ${usuario?.nome.split(" ")[0] ?? ""}!`} subtitulo="Gerencie a Y3D Creations." />
      <div className="grid">
        {ATALHOS.map((a) => (
          <AtalhoCard key={a.to} {...a} />
        ))}
      </div>
    </>
  );
}
