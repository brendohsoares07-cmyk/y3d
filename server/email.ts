import type { Request } from "express";
import nodemailer from "nodemailer";

/** Configuração SMTP. Para Gmail use uma "senha de app" do Google, nunca a senha normal. */
function configuracao() {
  const host = (process.env.Y3D_SMTP_HOST || "smtp.gmail.com").trim();
  const usuario = (process.env.Y3D_SMTP_USER || "").trim();
  const senha = (process.env.Y3D_SMTP_PASSWORD || "").replace(/\s+/g, "");
  const remetente = (process.env.Y3D_EMAIL_FROM || usuario).trim();
  const porta = Number(process.env.Y3D_SMTP_PORT || 587);
  const criptografia = (process.env.Y3D_SMTP_ENCRYPTION || "tls").trim().toLowerCase();
  const pronto = host !== "" && usuario !== "" && senha !== "" && Number.isInteger(porta) && porta >= 1 && porta <= 65535 && ["tls", "ssl"].includes(criptografia);
  return { host, usuario, senha, remetente, porta, criptografia, pronto };
}

export const emailConfigurado = (): boolean => configuracao().pronto;

interface Mensagem {
  para: string;
  paraNome: string;
  assunto: string;
  corpo: string;
  responderPara?: string;
  responderNome?: string;
}

export async function enviarEmail(m: Mensagem): Promise<boolean> {
  const c = configuracao();
  if (!c.pronto) return false;
  try {
    const transporte = nodemailer.createTransport({
      host: c.host,
      port: c.porta,
      secure: c.criptografia === "ssl",
      requireTLS: c.criptografia === "tls",
      auth: { user: c.usuario, pass: c.senha },
    });
    await transporte.sendMail({
      from: { name: "Y3D Creations", address: c.remetente },
      to: { name: m.paraNome, address: m.para },
      subject: m.assunto,
      text: m.corpo,
      ...(m.responderPara ? { replyTo: { name: m.responderNome ?? "", address: m.responderPara } } : {}),
    });
    return true;
  } catch (erro) {
    console.error("O servidor SMTP não aceitou o e-mail:", erro instanceof Error ? erro.message : erro);
    return false;
  }
}

/** Endereço público do site, usado nos links enviados por e-mail (Y3D_BASE_URL ou o endereço da requisição). */
export function urlBasePublica(req: Request): string | null {
  const configurada = (process.env.Y3D_BASE_URL || "").trim();
  if (configurada !== "") {
    try {
      const url = new URL(configurada);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) return null;
      return configurada.replace(/\/+$/, "");
    } catch {
      return null;
    }
  }
  const host = req.get("host") ?? "";
  if (!/^[a-zA-Z0-9.-]+(:\d{1,5})?$/.test(host)) return null;
  return `${req.protocol}://${host}`;
}
