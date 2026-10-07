import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/store/Breadcrumb";
import { ProductAside } from "../../components/store/ProductAside";
import { ProductGallery } from "../../components/store/ProductGallery";
import { ProductInfo } from "../../components/store/ProductInfo";
import { TrustStrip } from "../../components/store/TrustStrip";
import { Alert } from "../../components/ui/Alert";
import { useOptions } from "../../hooks/useOptions";
import { ApiError } from "../../services/http";
import { categoriasApi, produtosApi } from "../../services/resources";
import { Produto } from "../../types";

/** Detalhe do produto. Funciona para qualquer produto do catálogo: /loja/produtos/:id */
export function ProductDetailPage() {
  const { id } = useParams();
  const categorias = useOptions(categoriasApi);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setProduto(null);
    setErro(null);
    produtosApi
      .get(Number(id))
      .then(setProduto)
      .catch((e: unknown) => setErro(e instanceof ApiError ? e.message : "Não foi possível carregar o produto"));
  }, [id]);

  if (erro) {
    return (
      <>
        <Alert>{erro}</Alert>
        <p><Link to="/loja/produtos">← Voltar aos produtos</Link></p>
      </>
    );
  }
  if (!produto) return <p className="muted">Carregando...</p>;

  return (
    <>
      <Breadcrumb atual={produto.nome} />
      <div className="detail-grid">
        <div>
          <ProductGallery produto={produto} />
          <TrustStrip />
        </div>
        <ProductInfo produto={produto} categoria={categorias.find((c) => c.id === produto.categoriaId)} />
        <ProductAside produto={produto} />
      </div>
    </>
  );
}
