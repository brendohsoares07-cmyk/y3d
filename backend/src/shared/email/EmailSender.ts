import net from "node:net";
import tls from "node:tls";

export type EmailConfig = { host: string; port: number; encryption: "tls" | "ssl"; user: string; password: string; from: string };
type SmtpSocket = net.Socket | tls.TLSSocket;

function resposta(socket: SmtpSocket): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const limpar = () => { socket.off("data", receber); socket.off("error", falhar); };
    const receber = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const linhas = buffer.split(/\r?\n/).filter(Boolean);
      if (!linhas.length) return;
      const codigo = linhas[0].slice(0, 3);
      if (linhas.some((linha) => linha.startsWith(`${codigo} `))) { limpar(); resolve(buffer); }
    };
    const falhar = (erro: Error) => { limpar(); reject(erro); };
    socket.on("data", receber); socket.on("error", falhar);
  });
}

async function comando(socket: SmtpSocket, texto: string, esperado: string): Promise<string> {
  const leitura = resposta(socket);
  socket.write(`${texto}\r\n`);
  const retorno = await leitura;
  if (!retorno.startsWith(esperado)) throw new Error(`SMTP recusou ${texto.split(" ")[0]}: ${retorno.trim()}`);
  return retorno;
}

export async function enviarEmail(config: EmailConfig, destinatario: string, assunto: string, corpo: string): Promise<void> {
  let socket: SmtpSocket;
  if (config.encryption === "ssl") {
    const secure = tls.connect({ host: config.host, port: config.port, servername: config.host });
    const greeting = resposta(secure);
    await new Promise<void>((resolve, reject) => { secure.once("secureConnect", resolve); secure.once("error", reject); });
    if (!(await greeting).startsWith("220")) throw new Error("Servidor SMTP não aceitou a conexão.");
    socket = secure;
  } else {
    const raw = net.createConnection({ host: config.host, port: config.port });
    const greeting = resposta(raw);
    await new Promise<void>((resolve, reject) => { raw.once("connect", resolve); raw.once("error", reject); });
    if (!(await greeting).startsWith("220")) throw new Error("Servidor SMTP não aceitou a conexão.");
    await comando(raw, "EHLO y3d.local", "250");
    await comando(raw, "STARTTLS", "220");
    const secure = tls.connect({ socket: raw, servername: config.host });
    await new Promise<void>((resolve, reject) => { secure.once("secureConnect", resolve); secure.once("error", reject); });
    socket = secure;
  }

  try {
    await comando(socket, "EHLO y3d.local", "250");
    await comando(socket, "AUTH LOGIN", "334");
    await comando(socket, Buffer.from(config.user).toString("base64"), "334");
    await comando(socket, Buffer.from(config.password).toString("base64"), "235");
    await comando(socket, `MAIL FROM:<${config.from}>`, "250");
    await comando(socket, `RCPT TO:<${destinatario}>`, "250");
    await comando(socket, "DATA", "354");
    const subject = `=?UTF-8?B?${Buffer.from(assunto).toString("base64")}?=`;
    const body = Buffer.from(corpo, "utf8").toString("base64").replace(/.{1,76}/g, "$&\r\n");
    const message = [`From: Y3D Creations <${config.from}>`, `To: ${destinatario}`, `Subject: ${subject}`, "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: base64", "", body, "."].join("\r\n");
    const envio = resposta(socket); socket.write(`${message}\r\n`);
    const retorno = await envio;
    if (!retorno.startsWith("250")) throw new Error(`SMTP não aceitou a mensagem: ${retorno.trim()}`);
    await comando(socket, "QUIT", "221");
  } finally { socket.end(); }
}
