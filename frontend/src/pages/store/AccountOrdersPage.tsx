import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { OrderCard } from "../../components/store/OrderCard";
import { Alert } from "../../components/ui/Alert";
import { Pagination } from "../../components/ui/Pagination";
import { useAuth } from "../../context/AuthContext";
import { useOptions } from "../../hooks/useOptions";
import { usePaginatedList } from "../../hooks/usePaginatedList";
import { pedidosApi, produtosApi } from "../../services/resources";
import { StatusPedido } from "../../types";

type Aba = { rotulo: string; status: StatusPedido[] | null };

const ABAS: Aba[] = [
  { rotulo: "Todos", status: null },
  { rotulo: "Em andamento", status: ["PENDENTE", "PAGO", "ENVIADO"] },
  { rotulo: "Concluídos", status: ["ENTREGUE"] },
  { rotulo: "Cancelados", status: ["CANCELADO"] },
];

/** Meus pedidos (só os do usuário logado) + Meus dados. */
export function AccountOrdersPage() {
  const { usuario } = useAuth();
  const location = useLocation();
  const aviso = (location.state as { mensagem?: string } | null)?.mensagem;
  const { items, page, totalPages, loading, error, setPage } = usePaginatedList(pedidosApi);
  const produtos = useOptions(produtosApi);
  const [aba, setAba] = useState(0);

  const filtro = ABAS[aba].status;
  const visiveis = filtro ? items.filter((p) => filtro.includes(p.status)) : items;

  return (
    <>
      {aviso && <Alert tipo="sucesso">{aviso}</Alert>}
      <h2>Meus pedidos</h2>
      <div className="tabs" role="tablist">
        {ABAS.map((a, i) => (
          <button key={a.rotulo} type="button" role="tab" aria-selected={i === aba} className={i === aba ? "tab on" : "tab"} onClick={() => setAba(i)}>
            {a.rotulo}
          </button>
        ))}
      </div>
      {error && <Alert>{error}</Alert>}
      {loading ? (
        <p className="muted">Carregando...</p>
      ) : visiveis.length === 0 ? (
        <p className="muted">Nenhum pedido por aqui. <Link to="/loja/produtos">Ver produtos</Link></p>
      ) : (
        <ul className="order-list">
          {visiveis.map((p) => (
            <OrderCard key={p.id} pedido={p} produtos={produtos} />
          ))}
        </ul>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <h2 className="mt">Meus dados</h2>
      <div className="my-data">
        <span><strong>Nome:</strong> {usuario?.nome}</span>
        <span><strong>E-mail:</strong> {usuario?.email}</span>
        <Link to="/loja/conta/perfil" className="btn btn-outline">Editar perfil</Link>
      </div>
    </>
  );
}
