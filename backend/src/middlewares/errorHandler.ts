import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

function codigoDe(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null) {
    if ("code" in err && typeof err.code === "string") return err.code;
    if ("type" in err && typeof err.type === "string") return err.type;
  }
  return undefined;
}

/** Converte qualquer erro em JSON { message } com o status HTTP correto. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  switch (codigoDe(err)) {
    case "entity.parse.failed":
      res.status(400).json({ message: "JSON inválido" });
      return;
    case "ER_DUP_ENTRY":
      res.status(409).json({ message: "Já existe um registro com estes dados" });
      return;
    case "ER_NO_REFERENCED_ROW_2":
      res.status(400).json({ message: "O registro relacionado informado não existe" });
      return;
    case "ER_ROW_IS_REFERENCED_2":
      res.status(409).json({ message: "Não é possível excluir: existem registros vinculados a este item" });
      return;
  }

  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor" });
}
