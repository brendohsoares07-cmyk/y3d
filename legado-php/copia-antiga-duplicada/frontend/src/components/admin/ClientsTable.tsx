import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { ApiError } from "../../services/http";
import { adminApi } from "../../services/resources";
import { ClienteAdmin, Page, StatusCliente } from "../../types";
import { formatMoney, iniciais } from "../../utils/format";
import { maskCpf } from "../../utils/validators";
import { Alert } from "../ui/Alert";
import { Pagination } from "../ui/Pagination";

type CpfCellProps = { cpf: string; visivel: boolean; onAlternar: () => void };

/** CPF escondido por padrão; o botão "ver" mostra o número completo (exclusivo desta tabela). */
function CpfCell({ cpf, visivel, onAlternar }: CpfCellProps) {
  return (
    <>
      <span className="cpf">{visivel ? maskCpf(cpf) : `•••.•••.•••-${cpf.slice(-2)}`}</span>
      <button type="button" className="eye" onClick={onAlternar}>
        {visivel ? "ocultar" : "ver"}
      </button>
    </>
  );
}

function ClienteRow({ cliente, cpfVisivel, onAlternarCpf }: { cliente: ClienteAdmin; cpfVisivel: boolean; onAlternarCpf: () => void }) {
  return (
    <tr>
      <td>
        <div className="who">
          <div className="avatar">{iniciais(cliente.nome)}</div>
          {cliente.nome}
        </div>
      </td>
      <td>
        <CpfCell cpf={cliente.cpf} visivel={cpfVisivel} onAlternar={onAlternarCpf} />
      </td>
      <td>{cliente.email}</td>
      <td>{cliente.pedidos}</td>
      <td>{formatMoney(cliente.gasto)}</td>
      <td>
        <span className={`tag ${cliente.status}`}>{cliente.status}</span>
      </td>
    </tr>
  );
}

/** 3º bloco: clientes cadastrados, com busca, filtro de status e paginação. */
export function ClientsTable() {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<StatusCliente | "">("");
  const [page, setPage] = useState(1);
  const [resultado, setResultado] = useState<Page<ClienteAdmin> | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [cpfsVisiveis, setCpfsVisiveis] = useState<Set<number>>(new Set());
  const buscaAtrasada = useDebounce(busca);

  useEffect(() => {
    let cancelado = false;
    adminApi
      .clientes({ page, busca: buscaAtrasada, status })
      .then((r) => {
        if (cancelado) return;
        setResultado(r);
        setErro(null);
      })
      .catch((e: unknown) => !cancelado && setErro(e instanceof ApiError ? e.message : "Erro ao carregar clientes"));
    return () => {
      cancelado = true;
    };
  }, [page, buscaAtrasada, status]);

  const alternarCpf = (id: number) =>
    setCpfsVisiveis((atual) => {
      const novo = new Set(atual);
      if (!novo.delete(id)) novo.add(id);
      return novo;
    });

  const clientes = resultado?.data ?? [];

  return (
    <section className="panel">
      <h2>
        Clientes cadastrados <em>{resultado ? `${resultado.total} resultado(s)` : ""}</em>
      </h2>
      <div className="tools">
        <input
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nome, e-mail ou CPF..."
          aria-label="Buscar clientes"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as StatusCliente | "");
            setPage(1);
          }}
          aria-label="Filtrar por status"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>
      {erro && <Alert>{erro}</Alert>}
      <div className="wrap">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Pedidos</th>
              <th>Total gasto</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty">
                  {resultado ? "Nenhum cliente encontrado" : "Carregando..."}
                </td>
              </tr>
            ) : (
              clientes.map((c) => (
                <ClienteRow key={c.id} cliente={c} cpfVisivel={cpfsVisiveis.has(c.id)} onAlternarCpf={() => alternarCpf(c.id)} />
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={resultado?.totalPages ?? 1} onChange={setPage} />
    </section>
  );
}
