import { Router } from "express";
import { BaseEntity } from "../shared/base/BaseEntity";
import { CrudController } from "../shared/base/CrudController";

/** Rotas REST padrão (list, get, create, update, delete) para qualquer CRUD. */
export function crudRouter<T extends BaseEntity, TInput>(controller: CrudController<T, TInput>): Router {
  const router = Router();
  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.post("/", controller.create);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.remove);
  return router;
}
