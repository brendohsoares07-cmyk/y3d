import { Router } from "express";
import { excluirProduto, salvarProduto } from "../catalogo.js";
import { avaliacaoRemover, mensagemMarcarLida, pedidoExcluir, pedidoMudarStatus } from "../loja.js";
import { montarPainel } from "../painel.js";
import { exigirAdmin } from "../sessao.js";
import { texto } from "../validacoes.js";
import { corpo, inteiro } from "./utilitarios.js";

/** Tudo aqui exige login de administrador (conta com "admin": true ou e-mail em ADMIN_EMAILS). */
export const rotasAdmin = Router();
rotasAdmin.use("/admin", exigirAdmin);

rotasAdmin.get("/admin/painel", async (_req, res) => void res.json(await montarPainel()));

rotasAdmin.post("/admin/pedidos/:id/status", async (req, res) => {
  const ok = await pedidoMudarStatus(inteiro(req.params.id), texto(corpo(req).status));
  res.status(ok ? 200 : 400).json(ok ? { ok: true } : { erro: "Não foi possível mudar o status do pedido." });
});

rotasAdmin.delete("/admin/pedidos/:id", async (req, res) => {
  const ok = await pedidoExcluir(inteiro(req.params.id));
  res.json(ok ? { sucesso: "Pedido excluído com sucesso." } : { erro: "Não foi possível excluir o pedido. Ele pode já ter sido removido." });
});

rotasAdmin.post("/admin/mensagens/:id/lida", async (req, res) => {
  await mensagemMarcarLida(inteiro(req.params.id));
  res.json({ ok: true });
});

rotasAdmin.delete("/admin/avaliacoes/:id", async (req, res) => {
  await avaliacaoRemover(inteiro(req.params.id));
  res.json({ ok: true });
});

rotasAdmin.post("/admin/produtos", async (req, res) => {
  const resultado = await salvarProduto(corpo(req), 0);
  res.status("erro" in resultado ? 400 : 201).json(resultado);
});

rotasAdmin.put("/admin/produtos/:id", async (req, res) => {
  const resultado = await salvarProduto(corpo(req), inteiro(req.params.id));
  res.status("erro" in resultado ? 400 : 200).json(resultado);
});

rotasAdmin.delete("/admin/produtos/:id", async (req, res) => {
  const resultado = await excluirProduto(inteiro(req.params.id));
  res.status("erro" in resultado ? 400 : 200).json(resultado);
});
