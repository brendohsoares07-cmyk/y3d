import { AvaliacaoProdutoPublica } from "../shared/types";

export interface IFeedbackRepository {
  avaliacoesProduto(produtoId: number): Promise<AvaliacaoProdutoPublica[]>;
  nomeUsuario(usuarioId: number): Promise<string | null>;
  salvarAvaliacaoProduto(
    produtoId: number,
    usuarioId: number,
    nomeUsuario: string,
    nota: number,
    comentario: string,
  ): Promise<void>;
  pedidoEntregue(pedidoId: number, usuarioId: number): Promise<boolean>;
  salvarAvaliacaoAtendimento(pedidoId: number, usuarioId: number, nota: number, comentario: string): Promise<void>;
}
