import { FormaPagamento } from "../../types";

const OPCOES: Array<{ valor: FormaPagamento; titulo: string; texto: string }> = [
  { valor: "PIX", titulo: "Pix", texto: "Aprovação imediata." },
  { valor: "CARTAO", titulo: "Cartão de crédito", texto: "Em até 12x (juros)." },
  { valor: "BOLETO", titulo: "Boleto", texto: "Em até 3 dias úteis." },
];

type Props = { valor: FormaPagamento; onChange: (forma: FormaPagamento) => void };

/** Forma de pagamento (escolha registrada no pedido; não há cobrança real neste projeto). */
export function PaymentOptions({ valor, onChange }: Props) {
  return (
    <fieldset className="payment">
      <legend>Forma de pagamento</legend>
      {OPCOES.map((o) => (
        <label key={o.valor} className={valor === o.valor ? "pay-option on" : "pay-option"}>
          <input type="radio" name="pagamento" value={o.valor} checked={valor === o.valor} onChange={() => onChange(o.valor)} />
          <span>
            <strong>{o.titulo}</strong>
            <small>{o.texto}</small>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
