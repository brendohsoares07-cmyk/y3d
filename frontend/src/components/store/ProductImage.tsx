import { Produto } from "../../types";
import { gradienteDoProduto } from "../../utils/store";

type Props = { produto: Produto; src?: string; className?: string };

/** Foto do produto; sem foto, mostra um degradê com o emoji do produto. */
export function ProductImage({ produto, src, className = "" }: Props) {
  const imagem = src ?? produto.imagens[0];
  if (imagem) {
    return <img className={`product-img ${className}`} src={imagem} alt={produto.nome} loading="lazy" />;
  }
  return (
    <div className={`product-img product-placeholder ${className}`} style={{ background: gradienteDoProduto(produto) }} role="img" aria-label={produto.nome}>
      <span>{produto.emoji ?? "🧊"}</span>
    </div>
  );
}
