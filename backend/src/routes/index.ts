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

routes.use("/categorias", authMiddleware, crudRouter(categoriaController));
routes.use("/produtos", authMiddleware, crudRouter(produtoController));
routes.use("/maquinas", authMiddleware, crudRouter(maquinaController));
routes.use("/pedidos", authMiddleware, crudRouter(pedidoController));
