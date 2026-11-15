import { Link } from "react-router-dom";
import { Alert } from "../../components/ui/Alert";
import { Column, DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { useOptions } from "../../hooks/useOptions";
import { usePaginatedList } from "../../hooks/usePaginatedList";
import { categoriasApi, produtosApi } from "../../services/resources";
import { Produto } from "../../types";
import { formatMoney } from "../../utils/format";

function CategoriaTag({ nome }: { nome: string }) {
  return <span className="badge">{nome}</span>;
}

export function ProdutosListPage() {
  const { items, page, totalPages, loading, error, setPage, remove } = usePaginatedList(produtosApi);
  const categorias = useOptions(categoriasApi);

  // relacionamento: mostra o nome da categoria de cada produto
  const nomeCategoria = (id: number) => categorias.find((c) => c.id === id)?.nome ?? `#${id}`;

  const colunas: Column<Produto>[] = [
    { header: "Nome", render: (p) => p.nome },
    { header: "Categoria", render: (p) => <CategoriaTag nome={nomeCategoria(p.categoriaId)} /> },
    { header: "Preço", render: (p) => formatMoney(p.preco) },
    { header: "Estoque", render: (p) => p.estoque },
  ];

  const excluir = (p: Produto) => {
    if (window.confirm(`Excluir o produto "${p.nome}"?`)) void remove(p.id);
  };

  return (
    <>
      <PageHeader
        titulo="Produtos"
        subtitulo="Peças e modelos 3D à venda."
        acao={<Link className="btn btn-primary" to="/produtos/novo">+ Novo produto</Link>}
      />
      {error && <Alert>{error}</Alert>}
      <DataTable columns={colunas} items={items} loading={loading}
        editPath={(p) => `/produtos/${p.id}/editar`} onDelete={excluir} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
}
