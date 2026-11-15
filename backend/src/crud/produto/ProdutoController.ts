import { Produto } from "./Produto";
import { ProdutoService } from "./ProdutoService";
import { ProdutoInput } from "../../shared/types";
import { CrudController } from "../../shared/base/CrudController";

export class ProdutoController extends CrudController<Produto, ProdutoInput> {
  constructor(service: ProdutoService) {
    super(service);
  }
}
