import { Link } from "react-router-dom";
import { Produto } from "../../types";
import { formatMoney } from "../../utils/format";
import { ProductImage } from "./ProductImage";
import { StarRating } from "./StarRating";

/** Cartão de produto usado na home, na listagem e nos favoritos. */
export function ProductCard({ produto, categoria }: { produto: Produto; categoria?: string }) {
  return (
    <Link to={`/loja/produtos/${produto.id}`} className="product-card">
      <ProductImage produto={produto} />
      <div className="product-card-body">
        {categoria && <span className="chip">{categoria}</span>}
        <h3>{produto.nome}</h3>
        <StarRating nota={produto.avaliacao} total={produto.totalAvaliacoes} />
        <strong className="price">{formatMoney(produto.preco)}</strong>
      </div>
    </Link>
  );
}
