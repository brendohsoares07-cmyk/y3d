import { Request, Response } from "express";
import { UnauthorizedError } from "../errors/AppError";
import { UsuarioService } from "../services/UsuarioService";
import { UpdateUsuarioInput } from "../types";
import { parseId } from "../utils/http";

export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  me = async (req: Request, res: Response): Promise<void> => {
    if (req.userId === undefined) throw new UnauthorizedError();
    res.json(await this.service.perfil(req.userId));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    if (req.userId === undefined) throw new UnauthorizedError();
    const usuario = await this.service.update(req.userId, parseId(req.params.id), req.body as UpdateUsuarioInput);
    res.json(usuario);
  };
}
