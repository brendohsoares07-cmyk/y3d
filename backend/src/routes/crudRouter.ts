import { RequestHandler, Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { BaseEntity } from "../shared/base/BaseEntity";
import { CrudController } from "../shared/base/CrudController";

/** Quem pode usar as rotas de um CRUD (todas já exigem JWT; aqui só se restringe a administradores). */
export interface CrudRouterOptions {
  /** Criar, editar e excluir só para administradores. */
  escritaSoAdmin?: boolean;
  /** Listar e buscar por id só para administradores. */
  leituraSoAdmin?: boolean;
}

/** Rotas REST padrão (list, get, create, update, delete) para qualquer CRUD. */
export function crudRouter<T extends BaseEntity, TInput>(
  controller: CrudController<T, TInput>,
  opcoes: CrudRouterOptions = {},
): Router {
  const leitura: RequestHandler[] = opcoes.leituraSoAdmin ? [adminMiddleware] : [];
  const escrita: RequestHandler[] = opcoes.escritaSoAdmin ? [adminMiddleware] : [];

  const router = Router();
  router.get("/", ...leitura, controller.list);
  router.get("/:id", ...leitura, controller.get);
  router.post("/", ...escrita, controller.create);
  router.put("/:id", ...escrita, controller.update);
  router.delete("/:id", ...escrita, controller.remove);
  return router;
}
