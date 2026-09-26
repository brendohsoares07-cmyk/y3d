import { Categoria } from "../entities/Categoria";
import { CategoriaService } from "../services/CategoriaService";
import { CategoriaInput } from "../types";
import { CrudController } from "./CrudController";

export class CategoriaController extends CrudController<Categoria, CategoriaInput> {
  constructor(service: CategoriaService) {
    super(service);
  }
}
