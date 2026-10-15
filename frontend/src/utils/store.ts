import { Produto, StatusPedido } from "../types";

/** Mesmo valor do backend (PedidoService.FRETE_FIXO). O servidor sempre recalcula o total. */
export const FRETE_FIXO = 12.9;

const GRADIENTES: Array<[string, string]> = [
  ["#3ddbf2", "#4b6bff"],
  ["#ffb03a", "#ff5c93"],
  ["#8b6bff", "#3ddbf2"],
  ["#ff5c93", "#8b6bff"],
  ["#3ddbb7", "#4b6bff"],
  ["#4b6bff", "#ff5c93"],
];

/** Gradiente estável por produto, usado quando ele não tem foto. */
export const gradienteDoProduto = (produto: Pick<Produto, "id">): string => {
  const [a, b] = GRADIENTES[produto.id % GRADIENTES.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
};

export const ROTULO_STATUS: Record<StatusPedido, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  ENVIADO: "Enviado",
  ENTREGUE: "Concluído",
  CANCELADO: "Cancelado",
};

export const formatDate = (iso: string | null): string => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "—");

export const maskTelefone = (valor: string): string => {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const maskCep = (valor: string): string => {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};
