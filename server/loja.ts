import type { AvaliacaoProduto, ItemPedido, Mensagem, Pedido, StatusPedido } from "../shared/tipos.js";
import { agora, alterarLista, lerLista, proximoId } from "./armazenamento.js";

export const STATUS_PEDIDO: Record<StatusPedido, string> = {
  aguardando: "Aguardando pagamento",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

// ---------- pedidos ----------

export type NovoPedido = Omit<Pedido, "id" | "status" | "criado_em">;

/** Registra um pedido novo e devolve o id (0 se falhar). */
export async function pedidoRegistrar(dados: NovoPedido): Promise<number> {
  let idNovo = 0;
  const ok = await alterarLista<Pedido>("pedidos", (lista) => {
    idNovo = proximoId(lista);
    return [...lista, { ...dados, id: idNovo, status: "aguardando", criado_em: agora() }];
  });
  return ok ? idNovo : 0;
}

export const pedidosListar = (): Promise<Pedido[]> => lerLista<Pedido>("pedidos");

export async function pedidoPorId(id: number): Promise<Pedido | null> {
  return (await pedidosListar()).find((p) => Number(p.id) === id) ?? null;
}

export async function pedidoMudarStatus(id: number, status: string): Promise<boolean> {
  if (!(status in STATUS_PEDIDO)) return false;
  return alterarLista<Pedido>("pedidos", (lista) =>
    lista.map((p) => (Number(p.id) === id ? { ...p, status: status as StatusPedido } : p)),
  );
}

export async function pedidoExcluir(id: number): Promise<boolean> {
  if (id <= 0) return false;
  let removido = false;
  const ok = await alterarLista<Pedido>("pedidos", (lista) =>
    lista.filter((p) => {
      if (Number(p.id) === id) {
        removido = true;
        return false;
      }
      return true;
    }),
  );
  return ok && removido;
}

/** Marca que o cliente informou ter feito o Pix; o pedido continua aguardando a conferência manual. */
export async function pedidoPixInformar(id: number): Promise<boolean> {
  let achou = false;
  const ok = await alterarLista<Pedido>("pedidos", (lista) =>
    lista.map((p) => {
      if (!achou && Number(p.id) === id && p.pagamento === "pix" && p.status === "aguardando") {
        achou = true;
        return p.pix_informado_em ? p : { ...p, pix_informado_em: agora() };
      }
      return p;
    }),
  );
  return ok && achou;
}

/** Guarda a avaliação do atendimento (nota 1 a 5 + comentário opcional). */
export async function pedidoAvaliar(id: number, nota: number, comentario: string): Promise<boolean> {
  const notaFinal = Math.max(1, Math.min(5, nota));
  let achou = false;
  const ok = await alterarLista<Pedido>("pedidos", (lista) =>
    lista.map((p) => {
      if (Number(p.id) !== id) return p;
      achou = true;
      return { ...p, avaliacao_atendimento: { nota: notaFinal, comentario, criado_em: agora() } };
    }),
  );
  return ok && achou;
}

export type { ItemPedido };

// ---------- mensagens de contato ----------

export const mensagensListar = (): Promise<Mensagem[]> => lerLista<Mensagem>("mensagens");

export function mensagemRegistrar(nome: string, email: string, texto: string): Promise<boolean> {
  return alterarLista<Mensagem>("mensagens", (lista) => [
    ...lista,
    { id: proximoId(lista), nome, email, mensagem: texto, lida: false, criado_em: agora() },
  ]);
}

export const mensagemMarcarLida = (id: number): Promise<boolean> =>
  alterarLista<Mensagem>("mensagens", (lista) => lista.map((m) => (Number(m.id) === id ? { ...m, lida: true } : m)));

// ---------- avaliações de produtos ----------

export const avaliacoesListar = (): Promise<AvaliacaoProduto[]> => lerLista<AvaliacaoProduto>("avaliacoes");

/** Cada cliente tem uma avaliação por produto: avaliar de novo substitui a anterior. */
export function avaliacaoSalvar(produtoId: number, usuarioId: number, nome: string, nota: number, comentario: string): Promise<boolean> {
  const notaFinal = Math.max(1, Math.min(5, nota));
  return alterarLista<AvaliacaoProduto>("avaliacoes", (lista) => {
    const restante = lista.filter((a) => !(Number(a.produto_id) === produtoId && Number(a.usuario_id) === usuarioId));
    return [
      ...restante,
      { id: proximoId(restante), produto_id: produtoId, usuario_id: usuarioId, nome, nota: notaFinal, comentario, criado_em: agora() },
    ];
  });
}

export const avaliacaoRemover = (id: number): Promise<boolean> =>
  alterarLista<AvaliacaoProduto>("avaliacoes", (lista) => lista.filter((a) => Number(a.id) !== id));

/** Avaliações de um produto, as mais novas primeiro. */
export async function avaliacoesDoProduto(produtoId: number): Promise<AvaliacaoProduto[]> {
  return (await avaliacoesListar())
    .filter((a) => Number(a.produto_id) === produtoId)
    .sort((a, b) => Number(b.criado_em) - Number(a.criado_em));
}
