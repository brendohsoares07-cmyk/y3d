import { Request } from "express";
import { ValidationError } from "../errors/AppError";

export function parseId(raw: unknown): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError("Id inválido");
  }
  return id;
}

export function parsePagination(req: Request): { page: number; limit: number } {
  const page = Math.max(1, Math.floor(Number(req.query.page)) || 1);
  const limit = Math.min(100, Math.max(1, Math.floor(Number(req.query.limit)) || 10));
  return { page, limit };
}
