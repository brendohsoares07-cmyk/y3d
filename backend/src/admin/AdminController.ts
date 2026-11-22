import { Request, Response } from "express";
import { AdminService } from "./AdminService";
import { StatusCliente } from "../shared/types";
import { parsePagination } from "../shared/utils/requestParams";

export class AdminController {
  constructor(private readonly service: AdminService) {}

  dashboard = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.service.dashboard());
  };

  clientes = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req);
    const busca = typeof req.query.busca === "string" ? req.query.busca : "";
    const status: StatusCliente | undefined =
      req.query.status === "ativo" || req.query.status === "inativo" ? req.query.status : undefined;
    res.json(await this.service.clientes(page, limit, busca, status));
  };

  avaliacoesAtendimento = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.service.avaliacoesAtendimento());
  };

  avaliacoesProdutos = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.service.avaliacoesProdutos());
  };

  mensagens = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.service.mensagens());
  };

  marcarMensagemLida = async (req: Request, res: Response): Promise<void> => {
    await this.service.marcarMensagemLida(Number(req.params.id));
    res.json({ message: "Mensagem marcada como lida." });
  };
}
