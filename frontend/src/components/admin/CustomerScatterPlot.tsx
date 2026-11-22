import { DispersaoCliente } from "../../types";
import { formatMoneyShort } from "../../utils/format";

export function CustomerScatterPlot({ dados }: { dados: DispersaoCliente[] }) {
  const largura = 720;
  const altura = 270;
  const esquerda = 52;
  const direita = 20;
  const topo = 20;
  const base = 220;
  const maiorQuantidade = Math.max(1, ...dados.map((item) => item.pedidos));
  const maiorGasto = Math.max(1, ...dados.map((item) => item.gasto));
  const x = (quantidade: number) => esquerda + (quantidade / maiorQuantidade) * (largura - esquerda - direita);
  const y = (gasto: number) => base - (gasto / maiorGasto) * (base - topo);

  return (
    <div className="panel analytics-wide">
      <h2>Frequência de compra × gasto por cliente <em>dispersão · até 100 clientes</em></h2>
      {dados.length === 0 ? (
        <p className="empty">Ainda não há pedidos válidos para comparar.</p>
      ) : (
        <svg className="analytics-svg scatter-svg" viewBox={`0 0 ${largura} ${altura}`} role="img" aria-label="Dispersão entre quantidade de pedidos e gasto por cliente">
          <title>Quantidade de pedidos comparada ao gasto por cliente</title>
          {[0, 0.5, 1].map((fracao) => {
            const posicaoY = base - fracao * (base - topo);
            const posicaoX = esquerda + fracao * (largura - esquerda - direita);
            return (
              <g key={fracao}>
                <line x1={esquerda} x2={largura - direita} y1={posicaoY} y2={posicaoY} className="analytics-gridline" />
                <line x1={posicaoX} x2={posicaoX} y1={topo} y2={base} className="analytics-gridline vertical" />
                <text x={esquerda - 8} y={posicaoY + 4} textAnchor="end" className="analytics-axis-label">
                  {formatMoneyShort(maiorGasto * fracao)}
                </text>
                <text x={posicaoX} y={altura - 12} textAnchor="middle" className="analytics-axis-label">
                  {Math.round(maiorQuantidade * fracao)}
                </text>
              </g>
            );
          })}
          {dados.map((item) => (
            <circle key={item.id} cx={x(item.pedidos)} cy={y(item.gasto)} r="5" className="scatter-point">
              <title>{`${item.nome}: ${item.pedidos} pedido(s), ${formatMoneyShort(item.gasto)}`}</title>
            </circle>
          ))}
          <text x={largura / 2} y={altura - 1} textAnchor="middle" className="analytics-axis-title">Pedidos válidos</text>
          <text transform={`translate(14 ${altura / 2}) rotate(-90)`} textAnchor="middle" className="analytics-axis-title">Gasto acumulado</text>
        </svg>
      )}
    </div>
  );
}
