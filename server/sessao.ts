import type { NextFunction, Request, Response } from "express";
import type { UsuarioPublico } from "../shared/tipos.js";
import { agora } from "./armazenamento.js";
import { contaPorId, ehAdministrador, type Conta } from "./contas.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request { usuario?: UsuarioPublico | null }
  }
}

const COOKIE_SESSAO = "y3d_sessao";
const COOKIE_PEDIDO = "y3d_pedido";

interface DadosSessao { id: number; loginEm: number; admin: boolean }

/** Estado do pedido recém-feito. */
export interface EstadoPedido { avaliar?: number; pix?: number; pixInformado?: number }

const opcoes = (req: Request) => ({ httpOnly: true, sameSite: "lax" as const, secure: req.secure, signed: true, path: "/" });

/** Registra o login. Só o login por e-mail + senha concede admin; o cadastro nunca concede. */
export function iniciarSessao(req: Request, res: Response, conta: Conta, permitirAdmin: boolean): void {
  const dados: DadosSessao = { id: Number(conta.id), loginEm: agora(), admin: permitirAdmin && ehAdministrador(conta) };
  res.cookie(COOKIE_SESSAO, dados, opcoes(req));
}

export function encerrarSessao(res: Response): void {
  res.clearCookie(COOKIE_SESSAO, { path: "/" });
  res.clearCookie(COOKIE_PEDIDO, { path: "/" });
}

/** Carrega o usuário logado (dados públicos da conta; a senha nunca sai daqui). */
export async function anexarUsuario(req: Request, _res: Response, next: NextFunction): Promise<void> {
  req.usuario = null;
  const bruto: unknown = req.signedCookies?.[COOKIE_SESSAO];
  if (bruto && typeof bruto === "object") {
    const dados = bruto as Partial<DadosSessao>;
    const conta = typeof dados.id === "number" ? await contaPorId(dados.id) : null;
    if (conta) {
      req.usuario = {
        id: Number(conta.id),
        nome: conta.nome,
        email: conta.email,
        foto: conta.foto ?? null,
        loginEm: Number(dados.loginEm ?? 0),
        admin: dados.admin === true && ehAdministrador(conta),
      };
    }
  }
  next();
}

export function exigirLogin(req: Request, res: Response, next: NextFunction): void {
  if (!req.usuario) {
    res.status(401).json({ erro: "Entre na sua conta para continuar." });
    return;
  }
  next();
}

export function exigirAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.usuario?.admin) {
    res.status(403).json({ erro: "Área restrita a administradores." });
    return;
  }
  next();
}

export function lerEstadoPedido(req: Request): EstadoPedido {
  const bruto: unknown = req.signedCookies?.[COOKIE_PEDIDO];
  return bruto && typeof bruto === "object" ? (bruto as EstadoPedido) : {};
}

export function gravarEstadoPedido(req: Request, res: Response, estado: EstadoPedido): void {
  res.cookie(COOKIE_PEDIDO, estado, opcoes(req));
}
