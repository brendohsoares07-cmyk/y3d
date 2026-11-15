import { Link } from "react-router-dom";
import { Alert } from "../../components/ui/Alert";
import { Column, DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { usePaginatedList } from "../../hooks/usePaginatedList";
import { pedidosApi } from "../../services/resources";
import { Pedido, StatusPedido } from "../../types";
import { formatMoney } from "../../utils/format";
import { formatDate, ROTULO_STATUS } from "../../utils/store";

function StatusTag({ status }: { status: StatusPedido }) {
  return <span className={`badge status-${status.toLowerCase()}`}>{ROTULO_STATUS[status]}</span>;
}

const COLUNAS: Column<Pedido>[] = [
  { header: "Nº", render: (p) => p.id },
  { header: "Data", render: (p) => formatDate(p.criadoEm) },
  { header: "Produtos", render: (p) => p.itens.reduce((soma, i) => soma + i.quantidade, 0) },
  { header: "Total", render: (p) => formatMoney(p.valorTotal) },
  { header: "Status", render: (p) => <StatusTag status={p.status} /> },
];

export function PedidosListPage() {
  const { items, page, totalPages, loading, error, setPage, remove } = usePaginatedList(pedidosApi);

  const excluir = (p: Pedido) => {
    if (window.confirm(`Excluir o pedido nº ${p.id}?`)) void remove(p.id);
  };

  return (
    <>
      <PageHeader
        titulo="Pedidos"
        subtitulo="Administradores veem todos os pedidos; clientes veem só os seus."
        acao={<Link className="btn btn-primary" to="/pedidos/novo">+ Novo pedido</Link>}
      />
      {error && <Alert>{error}</Alert>}
      <DataTable columns={COLUNAS} items={items} loading={loading}
        editPath={(p) => `/pedidos/${p.id}/editar`} onDelete={excluir} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
