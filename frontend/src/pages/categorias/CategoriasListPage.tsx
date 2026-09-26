import { Link } from "react-router-dom";
import { Alert } from "../../components/ui/Alert";
import { Column, DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { usePaginatedList } from "../../hooks/usePaginatedList";
import { categoriasApi } from "../../services/resources";
import { Categoria } from "../../types";

const COLUNAS: Column<Categoria>[] = [
  { header: "Nome", render: (c) => c.nome },
  { header: "Descrição", render: (c) => c.descricao ?? "—" },
];

export function CategoriasListPage() {
  const { items, page, totalPages, loading, error, setPage, remove } = usePaginatedList(categoriasApi);

  const excluir = (c: Categoria) => {
    if (window.confirm(`Excluir a categoria "${c.nome}"?`)) void remove(c.id);
  };

  return (
    <>
      <PageHeader
        titulo="Categorias"
        subtitulo="Agrupam os produtos do catálogo."
        acao={<Link className="btn btn-primary" to="/categorias/novo">+ Nova categoria</Link>}
      />
      {error && <Alert>{error}</Alert>}
      <DataTable columns={COLUNAS} items={items} loading={loading}
        editPath={(c) => `/categorias/${c.id}/editar`} onDelete={excluir} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
