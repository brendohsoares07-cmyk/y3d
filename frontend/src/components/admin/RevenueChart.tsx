import { ResumoAdmin } from "../../types";
import { formatMoneyShort } from "../../utils/format";

type Props = { dados: ResumoAdmin["faturamentoMensal"] };

export function RevenueChart({ dados }: Props) {
  const largura = 720;
  const altura = 270;
  const esquerda = 62;
  const direita = 20;
  const topo = 18;
  const base = 220;
  const areaLargura = largura - esquerda - direita;
  const valores = dados.flatMap((item) => [item.valor, item.tendencia]);
  const minimo = Math.min(0, ...valores);
  const maximo = Math.max(1, ...valores);
  const faixa = maximo - minimo || 1;
  const y = (valor: number) => base - ((valor - minimo) / faixa) * (base - topo);
  const passo = dados.length ? areaLargura / dados.length : areaLargura;
  const x = (indice: number) => esquerda + passo * (indice + 0.5);
  const pontosTendencia = dados.map((item, indice) => `${x(indice)},${y(item.tendencia)}`).join(" ");

  return (
    <div className="panel">
      <h2>Faturamento mensal <em>últimos 6 meses · tendência linear</em></h2>
      {dados.length === 0 ? (
        <p className="empty">Sem dados de faturamento no período.</p>
      ) : (
        <>
          <svg className="analytics-svg revenue-svg" viewBox={`0 0 ${largura} ${altura}`} role="img" aria-label="Faturamento mensal com linha de tendência linear">
            <title>Faturamento mensal e tendência linear</title>
            <defs>
              <linearGradient id="revenue-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ff4fd8" />
                <stop offset="100%" stopColor="#7c5cff" />
              </linearGradient>
            </defs>
            {[0, 0.5, 1].map((fracao) => {
              const valor = minimo + faixa * fracao;
              const posicao = y(valor);
              return (
                <g key={fracao}>
                  <line x1={esquerda} x2={largura - direita} y1={posicao} y2={posicao} className="analytics-gridline" />
                  <text x={esquerda - 8} y={posicao + 4} textAnchor="end" className="analytics-axis-label">
                    {formatMoneyShort(valor)}
                  </text>
                </g>
              );
            })}
            {dados.map((item, indice) => {
              const barraY = Math.min(y(0), y(item.valor));
              const barraAltura = Math.max(1, Math.abs(y(0) - y(item.valor)));
              const larguraBarra = Math.min(48, passo * 0.52);
              return (
                <g key={item.mes}>
                  <rect
                    x={x(indice) - larguraBarra / 2}
                    y={barraY}
                    width={larguraBarra}
                    height={barraAltura}
                    rx="6"
                    className="revenue-column"
                    fill="url(#revenue-gradient)"
                  >
                    <title>{`${item.mes}: ${formatMoneyShort(item.valor)}`}</title>
                  </rect>
                  <text x={x(indice)} y={altura - 12} textAnchor="middle" className="analytics-axis-label">{item.mes}</text>
                </g>
              );
            })}
            <polyline points={pontosTendencia} className="regression-line" />
            {dados.map((item, indice) => (
              <circle key={`${item.mes}-tendencia`} cx={x(indice)} cy={y(item.tendencia)} r="4" className="regression-point">
                <title>{`Tendência ${item.mes}: ${formatMoneyShort(item.tendencia)}`}</title>
              </circle>
            ))}
          </svg>
          <p className="chart-legend"><span className="legend-column" /> Faturamento <span className="legend-regression" /> Regressão linear</p>
        </>
      )}
    </div>
  );
}
