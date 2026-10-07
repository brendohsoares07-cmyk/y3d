import { Categoria } from "./Categoria";
import { CategoriaService } from "./CategoriaService";
import { CategoriaInput } from "../../shared/types";
import { CrudController } from "../../shared/base/CrudController";

export class CategoriaController extends CrudController<Categoria, CategoriaInput> {
  constructor(service: CategoriaService) {
    super(service);
  }
}
