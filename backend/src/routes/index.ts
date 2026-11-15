import { Router } from "express";
import {
  adminController,
  authController,
  categoriaController,
  maquinaController,
  pedidoController,
  produtoController,
  usuarioController,
} from "../container";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { crudRouter } from "./crudRouter";
import { pool } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { PasswordHasher } from "../auth/PasswordHasher";
import { env } from "../config/env";
import { enviarEmail } from "../shared/email/EmailSender";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Rotas públicas
routes.post("/auth/register", authController.register);
routes.post("/auth/login", authController.login);

// Recuperação de senha com token aleatório, hash no banco e validade curta.
routes.post("/auth/forgot-password", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) { res.status(400).json({ message: "Informe um e-mail válido." }); return; }
  if (!env.smtp.host || !env.smtp.user || !env.smtp.password || !env.smtp.from) {
    res.status(503).json({ message: "A recuperação por e-mail ainda não está configurada. Entre em contato com y3dsuporte@gmail.com." }); return;
  }
  const [users] = await pool.execute<RowDataPacket[]>("SELECT id, nome FROM usuarios WHERE email = ? LIMIT 1", [email]);
  if (users.length) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await pool.execute("DELETE FROM password_reset_tokens WHERE usuario_id = ?", [users[0].id]);
    await pool.execute("INSERT INTO password_reset_tokens (usuario_id, token_hash, expira_em) VALUES (?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 MINUTE))", [users[0].id, tokenHash]);
    const base = env.baseUrl.replace(/\/$/, "") || `${req.protocol}://${req.get("host")}`;
    const link = `${base}/login/redefinir-senha?token=${token}`;
    try {
      await enviarEmail(env.smtp, email, "Recuperação de senha — Y3D Creations", `Olá, ${users[0].nome}.\n\nPara criar uma nova senha, acesse o link abaixo em até 20 minutos:\n${link}\n\nSe você não solicitou esta alteração, ignore este e-mail.`);
    } catch (erro) {
      await pool.execute("DELETE FROM password_reset_tokens WHERE usuario_id = ?", [users[0].id]);
      console.error("Falha ao enviar e-mail de recuperação:", erro);
      res.status(503).json({ message: "Não foi possível enviar o e-mail agora. Tente novamente mais tarde." }); return;
    }
  }
  res.json({ message: "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação." });
});
routes.post("/auth/reset-password", async (req, res) => {
  const token = String(req.body?.token ?? ""); const senha = req.body?.senha;
  if (token.length < 32 || token.length > 256) { res.status(400).json({ message: "Link de recuperação inválido ou expirado." }); return; }
  const hasher: PasswordHasher = new PasswordHasher(); hasher.assertStrong(senha);
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT usuario_id FROM password_reset_tokens WHERE token_hash = ? AND expira_em > CURRENT_TIMESTAMP LIMIT 1", [tokenHash]);
  if (!rows.length) { res.status(400).json({ message: "Link de recuperação inválido ou expirado." }); return; }
  const senhaHash = await hasher.hash(senha);
  await pool.execute("UPDATE usuarios SET senha_hash = ? WHERE id = ?", [senhaHash, rows[0].usuario_id]);
  await pool.execute("DELETE FROM password_reset_tokens WHERE usuario_id = ?", [rows[0].usuario_id]);
  res.json({ message: "Senha alterada com sucesso." });
});

// Mensagens do formulário de contato (substitui o armazenamento em arquivos JSON da loja PHP).
routes.post("/contact/messages", async (req, res) => {
  const nome = String(req.body?.nome ?? "").trim();
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const mensagem = String(req.body?.mensagem ?? "").trim();
  if (nome.length < 2 || nome.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || mensagem.length < 5 || mensagem.length > 5000) {
    res.status(400).json({ message: "Informe nome, e-mail válido e mensagem entre 5 e 5000 caracteres." }); return;
  }
  await pool.execute("INSERT INTO mensagens (nome, email, mensagem) VALUES (?, ?, ?)", [nome, email, mensagem]);
  if (env.smtp.host && env.smtp.user && env.smtp.password && env.smtp.from) {
    try { await enviarEmail(env.smtp, env.smtp.user, "Nova mensagem recebida — Y3D", `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`); } catch (erro) { console.error("Falha ao notificar mensagem por e-mail:", erro); }
  }
  res.status(201).json({ message: "Mensagem enviada com sucesso." });
});

// Avaliações públicas de produtos e avaliação autenticada por cliente.
routes.get("/produtos/:id/avaliacoes", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) { res.status(400).json({ message: "Produto inválido." }); return; }
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT id, usuario_nome AS nome, nota, comentario, criado_em AS criadoEm FROM avaliacoes_produtos WHERE produto_id = ? ORDER BY criado_em DESC", [id]);
  res.json(rows);
});
routes.post("/produtos/:id/avaliacoes", authMiddleware, async (req, res) => {
  const produtoId = Number(req.params.id); const usuarioId = req.userId;
  const nota = Number(req.body?.nota); const comentario = String(req.body?.comentario ?? "").trim();
  if (!Number.isInteger(produtoId) || produtoId <= 0 || !usuarioId || !Number.isInteger(nota) || nota < 1 || nota > 5 || comentario.length > 600) {
    res.status(400).json({ message: "Avaliação inválida. Escolha uma nota de 1 a 5 e um comentário de até 600 caracteres." }); return;
  }
  const [users] = await pool.execute<RowDataPacket[]>("SELECT nome FROM usuarios WHERE id = ? LIMIT 1", [usuarioId]);
  if (!users.length) { res.status(401).json({ message: "Faça login novamente." }); return; }
  await pool.execute("INSERT INTO avaliacoes_produtos (produto_id, usuario_id, usuario_nome, nota, comentario) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE usuario_nome = VALUES(usuario_nome), nota = VALUES(nota), comentario = VALUES(comentario), criado_em = CURRENT_TIMESTAMP", [produtoId, usuarioId, users[0].nome, nota, comentario]);
  const [avg] = await pool.execute<RowDataPacket[]>("SELECT AVG(nota) AS avaliacao, COUNT(*) AS total FROM avaliacoes_produtos WHERE produto_id = ?", [produtoId]);
  await pool.execute("UPDATE produtos SET avaliacao = ?, total_avaliacoes = ? WHERE id = ?", [avg[0].avaliacao, avg[0].total, produtoId]);
  res.status(201).json({ message: "Avaliação salva com sucesso." });
});

// Tudo abaixo exige JWT
routes.get("/usuarios/me", authMiddleware, usuarioController.me);
routes.put("/usuarios/:id", authMiddleware, usuarioController.update);
routes.post("/usuarios/me/foto", authMiddleware, async (req, res) => {
  const usuarioId = req.userId; const arquivo = String(req.body?.arquivo ?? "");
  const match = arquivo.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!usuarioId || !match) { res.status(400).json({ message: "Envie uma imagem PNG, JPG ou WebP válida." }); return; }
  const extensao = match[1] === "jpeg" ? "jpg" : match[1]; const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > 2 * 1024 * 1024) { res.status(400).json({ message: "A imagem deve ter no máximo 2 MB." }); return; }
  const valido = extensao === "png" ? buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : extensao === "jpg" ? buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 : buffer.toString("ascii",0,4) === "RIFF" && buffer.toString("ascii",8,12) === "WEBP";
  if (!valido) { res.status(400).json({ message: "O arquivo enviado não corresponde ao formato informado." }); return; }
  const diretorio = path.join(process.cwd(), "uploads", "avatars"); await fs.mkdir(diretorio, { recursive: true });
  const nome = `usuario-${usuarioId}-${randomUUID()}.${extensao}`; await fs.writeFile(path.join(diretorio, nome), buffer, { flag: "wx" });
  const foto = `/uploads/avatars/${nome}`;
  const [antigo] = await pool.execute<RowDataPacket[]>("SELECT foto FROM usuarios WHERE id = ? LIMIT 1", [usuarioId]);
  await pool.execute("UPDATE usuarios SET foto = ? WHERE id = ?", [foto, usuarioId]);
  const caminhoAntigo = String(antigo[0]?.foto ?? "");
  if (caminhoAntigo.startsWith("/uploads/avatars/")) { try { await fs.unlink(path.join(diretorio, path.basename(caminhoAntigo))); } catch { /* arquivo antigo já removido */ } }
  res.json({ foto });
});

// Painel administrativo: JWT + ser administrador
routes.get("/admin/dashboard", authMiddleware, adminMiddleware, adminController.dashboard);
routes.get("/admin/clientes", authMiddleware, adminMiddleware, adminController.clientes);
routes.get("/admin/avaliacoes-atendimento", authMiddleware, adminMiddleware, async (_req, res) => {
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT a.id, a.pedido_id AS pedidoId, a.nota, a.comentario, a.criado_em AS criadoEm, u.nome, u.email FROM avaliacoes_atendimento a JOIN usuarios u ON u.id = a.usuario_id ORDER BY a.criado_em DESC");
  res.json(rows);
});
routes.get("/admin/avaliacoes-produtos", authMiddleware, adminMiddleware, async (_req, res) => {
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT a.id, a.produto_id AS produtoId, p.nome AS produto, a.usuario_nome AS nome, a.nota, a.comentario, a.criado_em AS criadoEm FROM avaliacoes_produtos a JOIN produtos p ON p.id = a.produto_id ORDER BY a.criado_em DESC");
  res.json(rows);
});
routes.get("/admin/mensagens", authMiddleware, adminMiddleware, async (_req, res) => {
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT id, nome, email, mensagem, lida, criado_em AS criadoEm FROM mensagens ORDER BY criado_em DESC");
  res.json(rows);
});
routes.post("/admin/mensagens/:id/lida", authMiddleware, adminMiddleware, async (req, res) => {
  const id = Number(req.params.id); if (!Number.isInteger(id) || id <= 0) { res.status(400).json({ message: "Mensagem inválida." }); return; }
  const [result] = await pool.execute<ResultSetHeader>("UPDATE mensagens SET lida = 1 WHERE id = ?", [id]);
  if (!result.affectedRows) { res.status(404).json({ message: "Mensagem não encontrada." }); return; }
  res.json({ message: "Mensagem marcada como lida." });
});

// Catálogo: qualquer usuário logado consulta, só administrador cria/edita/exclui.
// Máquinas são de uso interno: só administrador. Pedidos: o próprio PedidoController separa cliente e admin.
// Catálogo público: visitante pode navegar e consultar detalhes; escrita exige JWT + admin.
routes.get("/categorias", categoriaController.list);
routes.get("/categorias/:id", categoriaController.get);
routes.post("/categorias", authMiddleware, adminMiddleware, categoriaController.create);
routes.put("/categorias/:id", authMiddleware, adminMiddleware, categoriaController.update);
routes.delete("/categorias/:id", authMiddleware, adminMiddleware, categoriaController.remove);
routes.get("/produtos", produtoController.list);
routes.get("/produtos/:id", produtoController.get);
routes.post("/produtos", authMiddleware, adminMiddleware, produtoController.create);
routes.put("/produtos/:id", authMiddleware, adminMiddleware, produtoController.update);
routes.delete("/produtos/:id", authMiddleware, adminMiddleware, produtoController.remove);
routes.use("/maquinas", authMiddleware, crudRouter(maquinaController, { leituraSoAdmin: true, escritaSoAdmin: true }));
routes.post("/pedidos/:id/avaliacao-atendimento", authMiddleware, async (req, res) => {
  const id = Number(req.params.id); const usuarioId = req.userId; const nota = Number(req.body?.nota); const comentario = String(req.body?.comentario ?? "").trim();
  if (!Number.isInteger(id) || id <= 0 || !usuarioId || !Number.isInteger(nota) || nota < 1 || nota > 5 || comentario.length > 600) { res.status(400).json({ message: "Avaliação inválida." }); return; }
  const [orders] = await pool.execute<RowDataPacket[]>("SELECT id FROM pedidos WHERE id = ? AND usuario_id = ? AND status = 'ENTREGUE' LIMIT 1", [id, usuarioId]);
  if (!orders.length) { res.status(404).json({ message: "Pedido concluído não encontrado." }); return; }
  await pool.execute("INSERT INTO avaliacoes_atendimento (pedido_id, usuario_id, nota, comentario) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nota=VALUES(nota), comentario=VALUES(comentario), criado_em=CURRENT_TIMESTAMP", [id, usuarioId, nota, comentario]);
  res.status(201).json({ message: "Obrigado por avaliar nosso atendimento!" });
});
routes.post("/pedidos/:id/pix-informado", authMiddleware, async (req, res) => {
  const id = Number(req.params.id); const usuarioId = req.userId;
  if (!Number.isInteger(id) || id <= 0 || !usuarioId) { res.status(400).json({ message: "Pedido inválido." }); return; }
  const [result] = await pool.execute<ResultSetHeader>("UPDATE pedidos SET pix_informado_em = COALESCE(pix_informado_em, CURRENT_TIMESTAMP) WHERE id = ? AND usuario_id = ? AND forma_pagamento = 'PIX' AND status = 'PENDENTE'", [id, usuarioId]);
  if (!result.affectedRows) { res.status(404).json({ message: "Pedido não encontrado ou não está aguardando confirmação de Pix." }); return; }
  res.json({ message: "Pagamento informado. A equipe irá conferir o comprovante." });
});
routes.use("/pedidos", authMiddleware, crudRouter(pedidoController));
