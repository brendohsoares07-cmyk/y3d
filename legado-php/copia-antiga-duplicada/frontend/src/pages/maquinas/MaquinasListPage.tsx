import { Link } from "react-router-dom";
import { Alert } from "../../components/ui/Alert";
import { Column, DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { usePaginatedList } from "../../hooks/usePaginatedList";
import { maquinasApi } from "../../services/resources";
import { Maquina, TipoMaquina } from "../../types";

const ROTULOS: Record<TipoMaquina, string> = { FDM: "FDM", RESINA: "Resina", FECHADA: "Fechada (CoreXY)" };

function TipoTag({ tipo }: { tipo: TipoMaquina }) {
  return <span className="badge">{ROTULOS[tipo]}</span>;
}

const COLUNAS: Column<Maquina>[] = [
  { header: "Nome", render: (m) => m.nome },
  { header: "Tipo", render: (m) => <TipoTag tipo={m.tipo} /> },
  { header: "Volume de impressão", render: (m) => m.volumeImpressao },
];

export function MaquinasListPage() {
  const { items, page, totalPages, loading, error, setPage, remove } = usePaginatedList(maquinasApi);

  const excluir = (m: Maquina) => {
    if (window.confirm(`Excluir a máquina "${m.nome}"?`)) void remove(m.id);
  };

  return (
    <>
      <PageHeader
        titulo="Máquinas"
        subtitulo="Impressoras 3D usadas na produção."
        acao={<Link className="btn btn-primary" to="/maquinas/novo">+ Nova máquina</Link>}
      />
      {error && <Alert>{error}</Alert>}
      <DataTable columns={COLUNAS} items={items} loading={loading}
        editPath={(m) => `/maquinas/${m.id}/editar`} onDelete={excluir} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
