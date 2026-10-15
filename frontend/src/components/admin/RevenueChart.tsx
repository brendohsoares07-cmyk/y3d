import { ResumoAdmin } from "../../types";
import { formatMoney, formatMoneyShort } from "../../utils/format";

/** 2º bloco (esquerda): faturamento dos últimos 6 meses, em barras. */
export function RevenueChart({ dados }: { dados: ResumoAdmin["faturamentoMensal"] }) {
  const maximo = Math.max(...dados.map((d) => d.valor), 0);

  return (
    <div className="panel">
      <h2>
        Faturamento mensal <em>últimos 6 meses</em>
      </h2>
      <div className="chart">
        {dados.map((d) => (
          <div className="bar" key={d.mes}>
            <span>{formatMoneyShort(d.valor)}</span>
            <div style={{ height: `${maximo > 0 ? (d.valor / maximo) * 78 : 0}%` }} title={formatMoney(d.valor)} />
            {d.mes}
          </div>
        ))}
      </div>
    </div>
  );
}
