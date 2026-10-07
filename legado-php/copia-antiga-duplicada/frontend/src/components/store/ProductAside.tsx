import { useState } from "react";
import { Produto } from "../../types";
import { CardIcon, ChevronIcon, ShieldIcon, TruckIcon } from "./Icons";

const BENEFICIOS = [
  { icone: <TruckIcon size={30} />, titulo: "Envio rápido", texto: "para todo o Brasil" },
  { icone: <ShieldIcon size={30} />, titulo: "Compra segura", texto: "Seus dados protegidos" },
  { icone: <CardIcon size={30} />, titulo: "Diversas formas de pagamento", texto: "Pix, cartão, boleto" },
];

function Beneficio({ icone, titulo, texto }: { icone: JSX.Element; titulo: string; texto: string }) {
  return (
    <li className="benefit">
      {icone}
      <div>
        <strong>{titulo}</strong>
        <small>{texto}</small>
      </div>
    </li>
  );
}

/** Botões de compartilhar: WhatsApp, X e copiar link. */
function ShareButtons({ produto }: { produto: Produto }) {
  const [copiado, setCopiado] = useState(false);
  const url = window.location.href;
  const texto = encodeURIComponent(`${produto.nome} na Y3D Creations`);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="share">
      <a className="share-btn" href={`https://wa.me/?text=${texto}%20${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">WhatsApp</a>
      <a className="share-btn" href={`https://twitter.com/intent/tweet?text=${texto}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">X</a>
      <button type="button" className="share-btn" onClick={copiar}>{copiado ? "Link copiado!" : "Copiar link"}</button>
    </div>
  );
}

/** Coluna da direita: benefícios, compartilhar e descrição completa (abre e fecha). */
export function ProductAside({ produto }: { produto: Produto }) {
  const [aberto, setAberto] = useState(true);

  return (
    <aside className="panel product-aside">
      <ul className="benefits">
        {BENEFICIOS.map((b) => (
          <Beneficio key={b.titulo} {...b} />
        ))}
      </ul>
      <div className="aside-block">
        <strong>Compartilhar:</strong>
        <ShareButtons produto={produto} />
      </div>
      <div className="aside-block">
        <button type="button" className="accordion" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
          <strong>Descrição completa</strong>
          <span className={aberto ? "chev open" : "chev"}><ChevronIcon size={18} /></span>
        </button>
        {aberto && (
          <ul className="details">
            {produto.detalhes.length > 0 ? produto.detalhes.map((d) => <li key={d}>{d}</li>) : <li>Sem detalhes adicionais.</li>}
          </ul>
        )}
      </div>
    </aside>
  );
}
