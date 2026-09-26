import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";
import { StatusCliente } from "../types";
import { parsePagination } from "../utils/http";

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
}
