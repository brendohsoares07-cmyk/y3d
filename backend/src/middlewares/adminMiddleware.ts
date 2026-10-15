import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors/AppError";

/** Usar depois do authMiddleware: só deixa passar administradores (claim "admin" do JWT). */
export function adminMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (!req.isAdmin) throw new ForbiddenError("Acesso restrito a administradores");
  next();
}
