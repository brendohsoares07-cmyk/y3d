import { ReceitaCategoria } from "../../types";
import { formatMoneyShort } from "../../utils/format";

export function CategoryRevenueChart({ dados }: { dados: ReceitaCategoria[] }) {
  const maior = Math.max(1, ...dados.map((item) => item.receita));

  return (
    <div className="panel">
      <h2>Faturamento por categoria <em>sem frete</em></h2>
      {dados.length === 0 ? (
        <p className="empty">Nenhuma categoria cadastrada.</p>
      ) : (
        <div className="distribution-chart" role="img" aria-label="Faturamento por categoria de produto">
          {dados.map((item) => (
            <div className="distribution-row" key={item.categoria}>
              <span title={item.categoria}>{item.categoria}</span>
              <div className="distribution-track">
                <div className="category-bar" style={{ width: `${(item.receita / maior) * 100}%` }} />
              </div>
              <strong>{formatMoneyShort(item.receita)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
