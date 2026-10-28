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

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Rotas públicas
routes.post("/auth/register", authController.register);
routes.post("/auth/login", authController.login);

// Tudo abaixo exige JWT
routes.get("/usuarios/me", authMiddleware, usuarioController.me);
routes.put("/usuarios/:id", authMiddleware, usuarioController.update);

// Painel administrativo: JWT + ser administrador
routes.get("/admin/dashboard", authMiddleware, adminMiddleware, adminController.dashboard);
routes.get("/admin/clientes", authMiddleware, adminMiddleware, adminController.clientes);

// Catálogo: qualquer usuário logado consulta, só administrador cria/edita/exclui.
// Máquinas são de uso interno: só administrador. Pedidos: o próprio PedidoController separa cliente e admin.
routes.use("/categorias", authMiddleware, crudRouter(categoriaController, { escritaSoAdmin: true }));
routes.use("/produtos", authMiddleware, crudRouter(produtoController, { escritaSoAdmin: true }));
routes.use("/maquinas", authMiddleware, crudRouter(maquinaController, { leituraSoAdmin: true, escritaSoAdmin: true }));
routes.use("/pedidos", authMiddleware, crudRouter(pedidoController));
