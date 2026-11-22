import { Request, Response } from "express";
import { FeedbackService } from "./FeedbackService";

export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  avaliacoesProduto = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.service.avaliacoesProduto(Number(req.params.id)));
  };

  avaliarProduto = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as Record<string, unknown>;
    await this.service.avaliarProduto(Number(req.params.id), req.userId, body?.nota, body?.comentario);
    res.status(201).json({ message: "Avaliação salva com sucesso." });
  };

  avaliarAtendimento = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as Record<string, unknown>;
    await this.service.avaliarAtendimento(Number(req.params.id), req.userId, body?.nota, body?.comentario);
    res.status(201).json({ message: "Obrigado por avaliar nosso atendimento!" });
  };
}
