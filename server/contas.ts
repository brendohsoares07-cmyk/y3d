import bcrypt from "bcryptjs";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { EMAILS_ADMIN } from "./config.js";
import { agora, alterarLista, lerLista, proximoId } from "./armazenamento.js";

/** Mesmo formato de data/usuarios.json do site PHP (as senhas bcrypt "$2y$" continuam valendo). */
export interface Conta {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  foto: string | null;
  criado_em: number;
  admin?: boolean;
  cpf?: string;
  atualizado_em?: number;
  token_senha_hash?: string;
  token_senha_expira_em?: number;
}

export const emailNormalizado = (email: string): string => email.trim().toLowerCase();
export const contasCarregar = (): Promise<Conta[]> => lerLista<Conta>("usuarios");

export async function contaPorEmail(email: string): Promise<Conta | null> {
  const alvo = emailNormalizado(email);
  return (await contasCarregar()).find((c) => emailNormalizado(c.email ?? "") === alvo) ?? null;
}

export async function contaPorId(id: number): Promise<Conta | null> {
  return (await contasCarregar()).find((c) => Number(c.id) === id) ?? null;
}

export const ehAdministrador = (conta: Conta): boolean =>
  conta.admin === true || EMAILS_ADMIN.includes(emailNormalizado(conta.email ?? ""));

/** Cria uma conta comum (e-mail + senha). Devolve null se o e-mail já existir. */
export async function criarConta(nome: string, email: string, senha: string): Promise<Conta | null> {
  const senhaHash = await bcrypt.hash(senha, 10);
  let criada: Conta | null = null;
  const ok = await alterarLista<Conta>("usuarios", (contas) => {
    if (contas.some((c) => emailNormalizado(c.email ?? "") === emailNormalizado(email))) return contas;
    criada = {
      id: proximoId(contas),
      nome: nome.trim(),
      email: emailNormalizado(email),
      senha_hash: senhaHash,
      foto: null,
      criado_em: agora(),
    };
    return [...contas, criada];
  });
  return ok ? criada : null;
}

export async function verificarSenha(conta: Conta, senha: string): Promise<boolean> {
  if (!conta.senha_hash) return false;
  try {
    return await bcrypt.compare(senha, conta.senha_hash);
  } catch {
    return false;
  }
}

const hashDoToken = (token: string): string => createHash("sha256").update(token).digest("hex");
const tokenValido = (token: string): boolean => /^[a-f0-9]{64}$/.test(token);

function hashesIguais(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Cria um token temporário de recuperação (válido por 1 hora) e guarda só o hash dele. */
export async function tokenSenhaCriar(email: string): Promise<string | null> {
  const token = randomBytes(32).toString("hex");
  const hash = hashDoToken(token);
  let achou = false;
  const ok = await alterarLista<Conta>("usuarios", (contas) =>
    contas.map((conta) => {
      if (achou || emailNormalizado(conta.email ?? "") !== emailNormalizado(email)) return conta;
      achou = true;
      return { ...conta, token_senha_hash: hash, token_senha_expira_em: agora() + 3600 };
    }),
  );
  return ok && achou ? token : null;
}

export async function contaPorTokenSenha(token: string): Promise<Conta | null> {
  if (!tokenValido(token)) return null;
  const hash = hashDoToken(token);
  return (
    (await contasCarregar()).find(
      (c) => Number(c.token_senha_expira_em ?? 0) > agora() && !!c.token_senha_hash && hashesIguais(c.token_senha_hash, hash),
    ) ?? null
  );
}

export async function senhaRedefinirComToken(token: string, senha: string): Promise<boolean> {
  if (!tokenValido(token)) return false;
  const hash = hashDoToken(token);
  const novoHash = await bcrypt.hash(senha, 10);
  let atualizou = false;
  const ok = await alterarLista<Conta>("usuarios", (contas) =>
    contas.map((conta) => {
      if (atualizou) return conta;
      if (Number(conta.token_senha_expira_em ?? 0) > agora() && !!conta.token_senha_hash && hashesIguais(conta.token_senha_hash, hash)) {
        atualizou = true;
        const { token_senha_hash: _h, token_senha_expira_em: _e, ...resto } = conta;
        return { ...resto, senha_hash: novoHash, atualizado_em: agora() };
      }
      return conta;
    }),
  );
  return ok && atualizou;
}

/** Atualiza nome e/ou foto de uma conta e devolve a conta já atualizada. */
export async function contaAtualizar(id: number, campos: Partial<Pick<Conta, "nome" | "foto">>): Promise<Conta | null> {
  let nova: Conta | null = null;
  const ok = await alterarLista<Conta>("usuarios", (contas) =>
    contas.map((conta) => {
      if (Number(conta.id) !== id) return conta;
      nova = { ...conta, ...campos, atualizado_em: agora() };
      return nova;
    }),
  );
  return ok ? nova : null;
}
