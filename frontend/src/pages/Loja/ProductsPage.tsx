import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductCard } from "../../components/store/ProductCard";
import { Pagination } from "../../components/ui/Pagination";
import { useOptions } from "../../hooks/useOptions";
import { categoriasApi, produtosApi } from "../../services/resources";

const POR_PAGINA = 12;

/** Todos os produtos, com busca (?q=) e filtro de categoria (?categoria=). */
export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const termo = (params.get("q") ?? "").trim().toLowerCase();
  const categoriaId = Number(params.get("categoria")) || 0;
  const [page, setPage] = useState(1);

  const produtos = useOptions(produtosApi);
  const categorias = useOptions(categoriasApi);

  useEffect(() => setPage(1), [termo, categoriaId]);

  const filtrados = produtos.filter(
    (p) =>
      (categoriaId === 0 || p.categoriaId === categoriaId) &&
      (termo === "" || `${p.nome} ${p.descricao ?? ""}`.toLowerCase().includes(termo)),
  );
  const totalPages = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const visiveis = filtrados.slice((page - 1) * POR_PAGINA, page * POR_PAGINA);

  const escolherCategoria = (id: number) => {
    const novo = new URLSearchParams(params);
    if (id === 0) novo.delete("categoria");
    else novo.set("categoria", String(id));
    setParams(novo);
  };

  return (
    <>
      <h1>Produtos</h1>
      <p className="muted">
        {filtrados.length} produto(s){termo ? ` para "${params.get("q")}"` : ""}
      </p>
      <div className="chips">
        <button type="button" className={categoriaId === 0 ? "chip on" : "chip"} onClick={() => escolherCategoria(0)}>Todos</button>
        {categorias.map((c) => (
          <button key={c.id} type="button" className={categoriaId === c.id ? "chip on" : "chip"} onClick={() => escolherCategoria(c.id)}>
            {c.nome}
          </button>
        ))}
      </div>

      {visiveis.length === 0 ? (
        <p className="muted">Nenhum produto encontrado.</p>
      ) : (
        <div className="product-grid">
          {visiveis.map((p) => (
            <ProductCard key={p.id} produto={p} categoria={categorias.find((c) => c.id === p.categoriaId)?.nome} />
          ))}
        </div>
      )}
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
    </>
  );
}
