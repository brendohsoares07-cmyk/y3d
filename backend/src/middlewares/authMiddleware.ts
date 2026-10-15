import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError } from "../errors/AppError";

/** Exige "Authorization: Bearer <jwt>" e guarda o id do usuário em req.userId. */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token não informado");
  }

  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    if (typeof payload === "string" || payload.sub === undefined) {
      throw new UnauthorizedError("Token inválido");
    }
    req.userId = Number(payload.sub);
    req.isAdmin = payload.admin === true;
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
  next();
}
