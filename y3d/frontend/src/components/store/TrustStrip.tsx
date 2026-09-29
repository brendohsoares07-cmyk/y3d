import { BoxIcon, ClockIcon, TruckIcon } from "./Icons";

const ITENS = [
  { icone: <ClockIcon size={30} />, linhas: ["Produção", "em até 5 dias"] },
  { icone: <TruckIcon size={30} />, linhas: ["Pagamento seguro", "(Pix, cartão, boleto)"] },
  { icone: <BoxIcon size={30} />, linhas: ["Enviamos", "para todo o Brasil"] },
];

/** Faixa de garantias abaixo da galeria. */
export function TrustStrip() {
  return (
    <div className="trust-strip">
      {ITENS.map((i) => (
        <div key={i.linhas[0]} className="trust-item">
          {i.icone}
          <span>{i.linhas[0]}<br />{i.linhas[1]}</span>
        </div>
      ))}
    </div>
  );
}
