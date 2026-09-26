import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { LoginInput, RegisterInput } from "../types";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const usuario = await this.service.register(req.body as RegisterInput);
    res.status(201).json(usuario);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.service.login(req.body as LoginInput));
  };
}
