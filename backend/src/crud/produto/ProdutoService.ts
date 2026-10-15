import { Produto } from "./Produto";
import { IRepository } from "../../shared/base/IRepository";
import { ProdutoInput } from "../../shared/types";
import { CrudService } from "../../shared/base/CrudService";

export class ProdutoService extends CrudService<Produto, ProdutoInput> {
  constructor(repository: IRepository<Produto>) {
    super(repository, "Produto não encontrado");
  }

  protected build(input: ProdutoInput, id?: number): Produto {
    return new Produto({ ...input, id });
  }
}
