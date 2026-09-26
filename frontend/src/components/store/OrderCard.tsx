import { useState } from "react";
import { Pedido, Produto } from "../../types";
import { formatMoney } from "../../utils/format";
import { formatDate, ROTULO_STATUS } from "../../utils/store";
import { ChevronIcon } from "./Icons";

const PAGAMENTO = { PIX: "Pix", CARTAO: "Cartão de crédito", BOLETO: "Boleto" } as const;

/** Detalhes abertos do pedido: itens, pagamento e endereço (exclusivo do cartão). */
function OrderDetails({ pedido, produtos }: { pedido: Pedido; produtos: Produto[] }) {
  const nome = (id: number) => produtos.find((p) => p.id === id)?.nome ?? `Produto #${id}`;
  return (
    <div className="order-details">
      <ul>
        {pedido.itens.map((i) => (
          <li key={`${i.produtoId}-${i.personalizacao ?? ""}`}>
            <span>{i.quantidade}× {nome(i.produtoId)}{i.personalizacao ? ` (${i.personalizacao})` : ""}</span>
            <span>{formatMoney(i.precoUnitario * i.quantidade)}</span>
          </li>
        ))}
        <li><span>Frete</span><span>{formatMoney(pedido.frete)}</span></li>
      </ul>
      <p><strong>Pagamento:</strong> {PAGAMENTO[pedido.formaPagamento]}</p>
      {pedido.entrega && (
        <p>
          <strong>Entrega:</strong> {pedido.entrega.nome} — {pedido.entrega.endereco}, {pedido.entrega.bairro}, {pedido.entrega.cidade}
        </p>
      )}
    </div>
  );
}

/** Linha do pedido: número, data, quantidade, total e status. Clique para ver os detalhes. */
export function OrderCard({ pedido, produtos }: { pedido: Pedido; produtos: Produto[] }) {
  const [aberto, setAberto] = useState(false);
  const quantidade = pedido.itens.reduce((soma, i) => soma + i.quantidade, 0);

  return (
    <li className="order-card">
      <button type="button" className="order-head" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
        <span>
          <strong>#{pedido.id}</strong> <small>{formatDate(pedido.criadoEm)}</small>
          <br />
          <small>{quantidade} {quantidade === 1 ? "produto" : "produtos"}</small>
        </span>
        <strong>{formatMoney(pedido.valorTotal)}</strong>
        <span className={`status status-${pedido.status.toLowerCase()}`}>{ROTULO_STATUS[pedido.status]}</span>
        <span className={aberto ? "chev open" : "chev"}><ChevronIcon size={18} /></span>
      </button>
      {aberto && <OrderDetails pedido={pedido} produtos={produtos} />}
    </li>
  );
}
