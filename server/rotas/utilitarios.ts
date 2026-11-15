import type { Request } from "express";
import type { UsuarioPublico } from "../../shared/tipos.js";
import type { Conta } from "../contas.js";

/** Corpo JSON da requisição como um objeto qualquer (cada rota valida o que lê). */
export function corpo(req: Request): Record<string, unknown> {
  return req.body && typeof req.body === "object" && !Array.isArray(req.body) ? (req.body as Record<string, unknown>) : {};
}

export const inteiro = (valor: unknown): number => {
  const n = typeof valor === "number" ? valor : Number(typeof valor === "string" ? valor : NaN);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
};

export function usuarioDaConta(conta: Conta, loginEm: number, admin: boolean): UsuarioPublico {
  return { id: Number(conta.id), nome: conta.nome, email: conta.email, foto: conta.foto ?? null, loginEm, admin };
}
