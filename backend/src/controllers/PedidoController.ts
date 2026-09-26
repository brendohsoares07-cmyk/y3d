import { Request, Response } from "express";
import { Pedido } from "../entities/Pedido";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../errors/AppError";
import { PedidoService } from "../services/PedidoService";
import { PedidoInput } from "../types";
import { parseId, parsePagination } from "../utils/http";
import { CrudController } from "./CrudController";

/**
 * Cliente vê e cria apenas os próprios pedidos; administrador vê todos
 * e é o único que altera o status ou exclui.
 */
export class PedidoController extends CrudController<Pedido, PedidoInput> {
  constructor(private readonly pedidos: PedidoService) {
    super(pedidos);
  }

  private usuarioAutenticado(req: Request): number {
    if (req.userId === undefined) throw new UnauthorizedError();
    return req.userId;
  }

  private exigirAdmin(req: Request): void {
    if (!req.isAdmin) throw new ForbiddenError("Apenas administradores podem fazer isso");
  }

  /** O dono do pedido é sempre o usuário do token, nunca o que vem no corpo. */
  protected override buildInput(req: Request): PedidoInput {
    return { ...(req.body as PedidoInput), usuarioId: this.usuarioAutenticado(req) };
  }

  override list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req);
    const usuarioId = this.usuarioAutenticado(req);
    res.json(req.isAdmin ? await this.pedidos.list(page, limit) : await this.pedidos.listByUsuario(usuarioId, page, limit));
  };

  override get = async (req: Request, res: Response): Promise<void> => {
    const usuarioId = this.usuarioAutenticado(req);
    const pedido = await this.pedidos.get(parseId(req.params.id));
    // pedido de outra pessoa é tratado como inexistente
    if (!req.isAdmin && pedido.usuarioId !== usuarioId) throw new NotFoundError("Pedido não encontrado");
    res.json(pedido);
  };

  override update = async (req: Request, res: Response): Promise<void> => {
    this.exigirAdmin(req);
    res.json(await this.pedidos.update(parseId(req.params.id), this.buildInput(req)));
  };

  override remove = async (req: Request, res: Response): Promise<void> => {
    this.exigirAdmin(req);
    await this.pedidos.remove(parseId(req.params.id));
    res.status(204).send();
  };
}
