import { useState } from "react";
import { Produto } from "../../types";
import { ProductImage } from "./ProductImage";

/** Miniaturas à esquerda + imagem principal. Sem foto, usa o degradê com emoji. */
export function ProductGallery({ produto }: { produto: Produto }) {
  const [indice, setIndice] = useState(0);
  const fotos = produto.imagens;

  return (
    <div className="gallery">
      {fotos.length > 1 && (
        <div className="gallery-thumbs">
          {fotos.map((foto, i) => (
            <button key={foto} type="button" className={i === indice ? "thumb on" : "thumb"} onClick={() => setIndice(i)}
              aria-label={`Ver foto ${i + 1}`}>
              <img src={foto} alt="" />
            </button>
          ))}
        </div>
      )}
      <div className="gallery-main">
        <ProductImage produto={produto} src={fotos[indice]} />
      </div>
    </div>
  );
}
