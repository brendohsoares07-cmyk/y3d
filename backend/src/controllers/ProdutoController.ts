import { Produto } from "../entities/Produto";
import { ProdutoService } from "../services/ProdutoService";
import { ProdutoInput } from "../types";
import { CrudController } from "./CrudController";

export class ProdutoController extends CrudController<Produto, ProdutoInput> {
  constructor(service: ProdutoService) {
    super(service);
  }
}
