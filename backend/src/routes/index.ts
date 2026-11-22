import { Router } from "express";
import {
  adminController,
  authController,
  categoriaController,
  contactController,
  feedbackController,
  maquinaController,
  pedidoController,
  produtoController,
  usuarioController,
} from "../container";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { crudRouter } from "./crudRouter";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Rotas públicas
routes.post("/auth/register", authController.register);
routes.post("/auth/login", authController.login);

routes.post("/auth/forgot-password", authController.forgotPassword);
routes.post("/auth/reset-password", authController.resetPassword);

// Mensagens recebidas pelo formulário de contato.
routes.post("/contact/messages", contactController.criar);

// Avaliações públicas de produtos e avaliação autenticada por cliente.
routes.get("/catalogo/produtos/:id/avaliacoes", feedbackController.avaliacoesProduto);
routes.post("/produtos/:id/avaliacoes", authMiddleware, feedbackController.avaliarProduto);

// Tudo abaixo exige JWT
routes.get("/usuarios/me", authMiddleware, usuarioController.me);
routes.put("/usuarios/:id", authMiddleware, usuarioController.update);
routes.post("/usuarios/me/foto", authMiddleware, usuarioController.atualizarFoto);

// Painel administrativo: JWT + ser administrador
routes.get("/admin/dashboard", authMiddleware, adminMiddleware, adminController.dashboard);
routes.get("/admin/clientes", authMiddleware, adminMiddleware, adminController.clientes);
routes.get("/admin/avaliacoes-atendimento", authMiddleware, adminMiddleware, adminController.avaliacoesAtendimento);
routes.get("/admin/avaliacoes-produtos", authMiddleware, adminMiddleware, adminController.avaliacoesProdutos);
routes.get("/admin/mensagens", authMiddleware, adminMiddleware, adminController.mensagens);
routes.post("/admin/mensagens/:id/lida", authMiddleware, adminMiddleware, adminController.marcarMensagemLida);

// Consulta pública e somente leitura do catálogo; as listas continuam paginadas.
routes.get("/catalogo/categorias", categoriaController.list);
routes.get("/catalogo/categorias/:id", categoriaController.get);
routes.get("/catalogo/produtos", produtoController.list);
routes.get("/catalogo/produtos/:id", produtoController.get);

// CRUD administrativo protegido: listar, consultar, criar, editar e excluir exigem JWT + admin.
routes.use("/categorias", authMiddleware, adminMiddleware, crudRouter(categoriaController));
routes.use("/produtos", authMiddleware, adminMiddleware, crudRouter(produtoController));

// Máquinas são de uso interno. Pedidos usam o próprio controller para separar cliente e admin.
routes.use("/maquinas", authMiddleware, crudRouter(maquinaController, { leituraSoAdmin: true, escritaSoAdmin: true }));
routes.post("/pedidos/:id/avaliacao-atendimento", authMiddleware, feedbackController.avaliarAtendimento);
routes.post("/pedidos/:id/pix-informado", authMiddleware, pedidoController.informarPagamentoPix);
routes.use("/pedidos", authMiddleware, crudRouter(pedidoController));
