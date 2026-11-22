import { Request, Response } from "express";
import { ContactService } from "./ContactService";

export class ContactController {
  constructor(private readonly service: ContactService) {}

  criar = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as Record<string, unknown>;
    await this.service.criar({ nome: body?.nome, email: body?.email, mensagem: body?.mensagem });
    res.status(201).json({ message: "Mensagem enviada com sucesso." });
  };
}
