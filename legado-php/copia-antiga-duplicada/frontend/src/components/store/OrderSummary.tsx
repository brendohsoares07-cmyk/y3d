import { CartItem } from "../../context/CartContext";
import { formatMoney } from "../../utils/format";
import { FRETE_FIXO } from "../../utils/store";
import { Button } from "../ui/Button";
import { LockIcon } from "./Icons";

type LinhaProps = {
  item: CartItem;
  onQuantidade: (n: number) => void;
  onRemover: () => void;
};

/** Uma linha do resumo: miniatura, nome, preço e quantidade (exclusivo do resumo). */
function LinhaItem({ item, onQuantidade, onRemover }: LinhaProps) {
  return (
    <li className="sum-item">
      {item.imagem ? <img src={item.imagem} alt="" /> : <div className="sum-thumb">{item.emoji ?? "🧊"}</div>}
      <div className="sum-info">
        <strong>{item.nome}</strong>
        {item.personalizacao && <small>{item.personalizacao}</small>}
        <span>{formatMoney(item.preco)}</span>
      </div>
      <div className="sum-qty">
        <select value={item.quantidade} onChange={(e) => onQuantidade(Number(e.target.value))} aria-label={`Quantidade de ${item.nome}`}>
          {Array.from({ length: Math.max(10, item.quantidade) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button type="button" className="link-btn" onClick={onRemover}>remover</button>
      </div>
    </li>
  );
}

type Props = {
  itens: CartItem[];
  subtotal: number;
  enviando: boolean;
  onQuantidade: (item: CartItem, n: number) => void;
  onRemover: (item: CartItem) => void;
};

/** 2) Revisão do pedido: itens, frete, total e botão de finalizar. */
export function OrderSummary({ itens, subtotal, enviando, onQuantidade, onRemover }: Props) {
  return (
    <>
      <ul className="sum-list">
        {itens.map((item) => (
          <LinhaItem key={`${item.produtoId}-${item.personalizacao ?? ""}`} item={item}
            onQuantidade={(n) => onQuantidade(item, n)} onRemover={() => onRemover(item)} />
        ))}
      </ul>
      <div className="sum-line"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
      <div className="sum-line"><span>Frete</span><span>{formatMoney(FRETE_FIXO)}</span></div>
      <div className="sum-line total"><span>Total</span><strong>{formatMoney(subtotal + FRETE_FIXO)}</strong></div>
      <Button type="submit" className="btn-wide" disabled={enviando}>{enviando ? "Enviando..." : "Finalizar pedido"}</Button>
      <p className="safe-note"><LockIcon size={14} /> Seus dados estão seguros</p>
    </>
  );
}
