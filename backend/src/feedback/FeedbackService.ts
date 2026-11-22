import { NotFoundError, UnauthorizedError, ValidationError } from "../errors/AppError";
import { AvaliacaoProdutoPublica } from "../shared/types";
import { IFeedbackRepository } from "./IFeedbackRepository";

const MENSAGEM_AVALIACAO_INVALIDA =
  "Avaliação inválida. Escolha uma nota de 1 a 5 e um comentário de até 600 caracteres.";

export class FeedbackService {
  constructor(private readonly repository: IFeedbackRepository) {}

  async avaliacoesProduto(produtoId: number): Promise<AvaliacaoProdutoPublica[]> {
    if (!Number.isInteger(produtoId) || produtoId <= 0) throw new ValidationError("Produto inválido.");
    return this.repository.avaliacoesProduto(produtoId);
  }

  async avaliarProduto(
    produtoId: number,
    usuarioId: number | undefined,
    notaInformada: unknown,
    comentarioInformado: unknown,
  ): Promise<void> {
    const nota = Number(notaInformada);
    const comentario = String(comentarioInformado ?? "").trim();
    if (
      !Number.isInteger(produtoId) ||
      produtoId <= 0 ||
      !usuarioId ||
      !Number.isInteger(nota) ||
      nota < 1 ||
      nota > 5 ||
      comentario.length > 600
    ) {
      throw new ValidationError(MENSAGEM_AVALIACAO_INVALIDA);
    }

    const nomeUsuario = await this.repository.nomeUsuario(usuarioId);
    if (!nomeUsuario) throw new UnauthorizedError("Faça login novamente.");
    await this.repository.salvarAvaliacaoProduto(produtoId, usuarioId, nomeUsuario, nota, comentario);
  }

  async avaliarAtendimento(
    pedidoId: number,
    usuarioId: number | undefined,
    notaInformada: unknown,
    comentarioInformado: unknown,
  ): Promise<void> {
    const nota = Number(notaInformada);
    const comentario = String(comentarioInformado ?? "").trim();
    if (
      !Number.isInteger(pedidoId) ||
      pedidoId <= 0 ||
      !usuarioId ||
      !Number.isInteger(nota) ||
      nota < 1 ||
      nota > 5 ||
      comentario.length > 600
    ) {
      throw new ValidationError("Avaliação inválida.");
    }
    if (!(await this.repository.pedidoEntregue(pedidoId, usuarioId))) {
      throw new NotFoundError("Pedido concluído não encontrado.");
    }
    await this.repository.salvarAvaliacaoAtendimento(pedidoId, usuarioId, nota, comentario);
  }
}
