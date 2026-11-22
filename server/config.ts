import "dotenv/config";
import path from "node:path";

/** Raiz do projeto: os scripts do npm sempre rodam a partir dela. */
export const RAIZ = process.cwd();

/** Pasta dos arquivos JSON (contas, pedidos, mensagens, avaliações, catálogo). */
export const PASTA_DADOS = path.resolve(process.env.Y3D_DATA_DIR || path.join(RAIZ, "data"));
export const PASTA_PUBLICA = path.join(RAIZ, "public");
export const PASTA_DIST = path.join(RAIZ, "dist");

export const PORTA = Number(process.env.PORT || 3001);
export const PRODUCAO = process.env.NODE_ENV === "production";

/** Segredo que assina os cookies de sessão. Em produção é obrigatório. */
function segredoDeSessao(): string {
  const valor = (process.env.SESSION_SECRET || "").trim();
  if (valor) return valor;
  if (PRODUCAO) throw new Error("Defina SESSION_SECRET no ambiente (ex.: openssl rand -hex 32).");
  return "y3d-segredo-so-para-desenvolvimento";
}
export const SEGREDO_SESSAO = segredoDeSessao();

/** E-mails (separados por vírgula) que viram administradores ao fazer login. Contas com "admin": true no JSON também valem. */
export const EMAILS_ADMIN = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const WHATSAPP_NUMERO = "554499638985";
export const EMAIL_SUPORTE = "y3dsuporte@gmail.com";
