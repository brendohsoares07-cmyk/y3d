import { ResumoAdmin } from "../../types";
import { formatMoney } from "../../utils/format";

/** 2º bloco (direita): clientes que mais gastaram. */
export function TopClients({ clientes }: { clientes: ResumoAdmin["topClientes"] }) {
  return (
    <div className="panel">
      <h2>
        Top clientes <em>por gasto</em>
      </h2>
      {clientes.length === 0 ? (
        <p className="empty">Sem clientes ainda</p>
      ) : (
        <ul className="top">
          {clientes.map((c, i) => (
            <li key={c.id}>
              <div>
                <span className="rank">{i + 1}</span>
                {c.nome}
              </div>
              <span>{formatMoney(c.gasto)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
