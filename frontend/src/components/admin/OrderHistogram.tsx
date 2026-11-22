import { FaixaPedido } from "../../types";

export function OrderHistogram({ dados }: { dados: FaixaPedido[] }) {
  const maior = Math.max(1, ...dados.map((item) => item.quantidade));

  return (
    <div className="panel">
      <h2>Distribuição do valor dos pedidos <em>histograma</em></h2>
      {dados.length === 0 ? (
        <p className="empty">Sem pedidos no período.</p>
      ) : (
        <div className="distribution-chart" role="img" aria-label="Quantidade de pedidos por faixa de valor">
          {dados.map((item) => (
            <div className="distribution-row" key={item.faixa}>
              <span>{item.faixa}</span>
              <div className="distribution-track">
                <div className="distribution-bar" style={{ width: `${(item.quantidade / maior) * 100}%` }} />
              </div>
              <strong>{item.quantidade}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
