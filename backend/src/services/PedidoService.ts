import { Entrega } from "../entities/Entrega";
import { Pedido } from "../entities/Pedido";
import { Produto } from "../entities/Produto";
import { NotFoundError, ValidationError } from "../errors/AppError";
import { IPedidoRepository, IRepository } from "../interfaces/IRepository";
import { ItemPedido, Page, PedidoInput } from "../types";
import { optionalText, requireInt } from "../utils/validators";
import { CrudService } from "./CrudService";

/** Frete fixo por pedido (R$). */
export const FRETE_FIXO = 12.9;
const MAX_ITENS = 50;

export class PedidoService extends CrudService<Pedido, PedidoInput> {
  constructor(
    private readonly pedidos: IPedidoRepository,
    private readonly produtos: IRepository<Produto>,
  ) {
    super(pedidos, "Pedido não encontrado");
  }

  /** Monta o pedido: o preço de cada item vem do banco, nunca do cliente. */
  protected async build(input: PedidoInput, id?: number): Promise<Pedido> {
    if (!Array.isArray(input.itens) || input.itens.length === 0) {
      throw new ValidationError("O pedido precisa ter ao menos um item");
    }
    if (input.itens.length > MAX_ITENS) {
      throw new ValidationError(`O pedido aceita no máximo ${MAX_ITENS} itens`);
    }

    const itens: ItemPedido[] = await Promise.all(
      input.itens.map(async (item) => {
        const produtoId = requireInt(item.produtoId, "produtoId", 1);
        const quantidade = requireInt(item.quantidade, "quantidade", 1, 1000);
        const produto = await this.produtos.findById(produtoId);
        if (!produto) throw new NotFoundError(`Produto ${produtoId} não encontrado`);
        return { produtoId, quantidade, precoUnitario: produto.preco, personalizacao: optionalText(item.personalizacao, 120) };
      }),
    );

    return new Pedido({
      id,
      usuarioId: input.usuarioId,
      itens,
      frete: FRETE_FIXO,
      formaPagamento: input.formaPagamento,
      entrega: input.entrega ? Entrega.criar(input.entrega) : null,
      status: "PENDENTE", // todo pedido novo começa pendente
    });
  }

  /** Depois de criado, só o status muda (itens e valores ficam congelados). */
  override async update(id: number, input: PedidoInput): Promise<Pedido> {
    const pedido = await this.getOrFail(id);
    if (input.status !== undefined) pedido.status = input.status;
    await this.pedidos.update(pedido);
    return this.getOrFail(id);
  }

  listByUsuario(usuarioId: number, page: number, limit: number): Promise<Page<Pedido>> {
    return this.pedidos.findPageByUsuario(usuarioId, page, limit);
  }
}
