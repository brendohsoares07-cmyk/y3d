import { Router } from "express";
import express from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import { agora } from "../armazenamento.js";
import { PASTA_DADOS } from "../config.js";
import {
  contaAtualizar, contaPorEmail, contaPorTokenSenha, criarConta, ehAdministrador,
  senhaRedefinirComToken, tokenSenhaCriar, verificarSenha,
} from "../contas.js";
import { emailConfigurado, enviarEmail, urlBasePublica } from "../email.js";
import { encerrarSessao, exigirLogin, iniciarSessao } from "../sessao.js";
import { emailValido, texto } from "../validacoes.js";
import { corpo, usuarioDaConta } from "./utilitarios.js";

export const rotasAuth = Router();

rotasAuth.post("/auth/login", async (req, res) => {
  const { email: e, senha: s } = corpo(req);
  const email = texto(e);
  const senha = typeof s === "string" ? s : "";
  if (email === "" || !emailValido(email)) return void res.status(400).json({ erro: "Digite um e-mail válido." });
  if ([...senha].length < 6) return void res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres." });
  const conta = await contaPorEmail(email);
  // mesma mensagem para e-mail inexistente e senha errada (não revela quais e-mails existem)
  if (!conta || !(await verificarSenha(conta, senha))) return void res.status(401).json({ erro: "E-mail ou senha incorretos." });
  iniciarSessao(req, res, conta, true);
  const admin = ehAdministrador(conta);
  res.json({ usuario: usuarioDaConta(conta, agora(), admin), destino: admin ? "/admin" : "/conta" });
});

rotasAuth.post("/auth/cadastro", async (req, res) => {
  const dados = corpo(req);
  const nome = texto(dados.nome);
  const email = texto(dados.email);
  const senha = typeof dados.senha === "string" ? dados.senha : "";
  const confirma = typeof dados.confirma === "string" ? dados.confirma : "";
  if (nome === "") return void res.status(400).json({ erro: "Digite seu nome." });
  if (email === "" || !emailValido(email)) return void res.status(400).json({ erro: "Digite um e-mail válido." });
  if ([...senha].length < 6) return void res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres." });
  if (senha !== confirma) return void res.status(400).json({ erro: "A confirmação da senha não é igual à senha." });
  const conta = await criarConta(nome, email, senha);
  if (!conta) return void res.status(409).json({ erro: "Já existe uma conta com esse e-mail. Tente entrar em vez de cadastrar." });
  iniciarSessao(req, res, conta, false); // o cadastro nunca concede admin
  res.status(201).json({ usuario: usuarioDaConta(conta, agora(), false) });
});

rotasAuth.post("/auth/logout", (_req, res) => {
  encerrarSessao(res);
  res.json({ ok: true });
});

rotasAuth.post("/auth/recuperar", async (req, res) => {
  const email = texto(corpo(req).email);
  if (!emailValido(email)) return void res.status(400).json({ erro: "Digite um e-mail válido." });
  if (!emailConfigurado()) {
    return void res.status(503).json({
      erro: "O envio ainda não está configurado. Preencha Y3D_SMTP_USER e Y3D_SMTP_PASSWORD no arquivo .env com uma senha de app do Gmail e reinicie o servidor.",
    });
  }
  const base = urlBasePublica(req);
  if (base === null) {
    return void res.status(500).json({ erro: "O endereço público da loja não está configurado corretamente. Entre em contato com o suporte da Y3D." });
  }
  const conta = await contaPorEmail(email);
  if (conta) {
    const token = await tokenSenhaCriar(email);
    if (token) {
      const link = `${base}/login?acao=redefinir&token=${encodeURIComponent(token)}`;
      const enviado = await enviarEmail({
        para: conta.email,
        paraNome: conta.nome,
        assunto: "Redefinição de senha · Y3D Creations",
        corpo:
          `Olá, ${conta.nome}!\n\nRecebemos um pedido para redefinir a senha da sua conta na Y3D Creations.\n` +
          `Use o link abaixo em até uma hora:\n\n${link}\n\nSe você não pediu a redefinição, ignore este e-mail.\n`,
      });
      if (!enviado) console.error("O e-mail de recuperação não foi aceito pelo servidor SMTP.");
    }
  }
  res.json({ ok: true }); // a resposta é a mesma exista a conta ou não
});

rotasAuth.get("/auth/token/:token", async (req, res) => {
  res.json({ valido: (await contaPorTokenSenha(req.params.token)) !== null });
});

rotasAuth.post("/auth/redefinir", async (req, res) => {
  const dados = corpo(req);
  const token = texto(dados.token);
  const senha = typeof dados.senha === "string" ? dados.senha : "";
  const confirma = typeof dados.confirma === "string" ? dados.confirma : "";
  if ((await contaPorTokenSenha(token)) === null) {
    return void res.status(400).json({ erro: "Este link é inválido ou expirou. Solicite uma nova redefinição.", linkInvalido: true });
  }
  if ([...senha].length < 6) return void res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres." });
  if (senha !== confirma) return void res.status(400).json({ erro: "A confirmação da senha não é igual à senha." });
  if (!(await senhaRedefinirComToken(token, senha))) {
    return void res.status(500).json({ erro: "Não foi possível redefinir a senha. Solicite um novo link e tente novamente.", linkInvalido: true });
  }
  res.json({ ok: true });
});

// ---------- perfil (Minha conta) ----------

rotasAuth.patch("/conta/nome", exigirLogin, async (req, res) => {
  const nome = texto(corpo(req).nome).replace(/\s+/g, " ");
  const tamanho = [...nome].length;
  if (tamanho < 2 || tamanho > 80) return void res.status(400).json({ erro: "O nome precisa ter entre 2 e 80 caracteres." });
  const conta = await contaAtualizar(req.usuario!.id, { nome });
  if (!conta) return void res.status(500).json({ erro: "Não foi possível atualizar o nome." });
  res.json({ usuario: { ...req.usuario!, nome: conta.nome } });
});

const PASTA_AVATARES = (): string => path.join(PASTA_DADOS, "avatares");
const TIPOS_FOTO: Record<string, { ext: string; confere: (b: Buffer) => boolean }> = {
  "image/jpeg": { ext: "jpg", confere: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", confere: (b) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) },
  "image/webp": { ext: "webp", confere: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
};

rotasAuth.post(
  "/conta/foto",
  exigirLogin,
  express.raw({ type: Object.keys(TIPOS_FOTO), limit: "2mb" }),
  async (req, res) => {
    const tipo = (req.get("content-type") ?? "").split(";")[0].trim();
    const regra = TIPOS_FOTO[tipo];
    const arquivo: unknown = req.body;
    if (!Buffer.isBuffer(arquivo) || arquivo.length === 0) return void res.status(400).json({ erro: "Escolha uma imagem para enviar." });
    if (!regra || !regra.confere(arquivo)) return void res.status(400).json({ erro: "Formato inválido. Envie uma foto JPG, PNG ou WEBP." });

    const usuario = req.usuario!;
    await fs.mkdir(PASTA_AVATARES(), { recursive: true });
    const nomeArquivo = `usuario-${usuario.id}-${agora()}.${regra.ext}`;
    await fs.writeFile(path.join(PASTA_AVATARES(), nomeArquivo), arquivo);
    // apaga a foto anterior se ela também foi enviada por upload
    if (usuario.foto?.startsWith("avatares/")) await fs.rm(path.join(PASTA_AVATARES(), path.basename(usuario.foto)), { force: true });
    const conta = await contaAtualizar(usuario.id, { foto: `avatares/${nomeArquivo}` });
    if (!conta) return void res.status(500).json({ erro: "Não foi possível atualizar a foto." });
    res.json({ usuario: { ...usuario, foto: conta.foto } });
  },
);
