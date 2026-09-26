import { Produto } from "../entities/Produto";
import { IRepository } from "../interfaces/IRepository";
import { ProdutoInput } from "../types";
import { CrudService } from "./CrudService";

export class ProdutoService extends CrudService<Produto, ProdutoInput> {
  constructor(repository: IRepository<Produto>) {
    super(repository, "Produto não encontrado");
  }

  protected build(input: ProdutoInput, id?: number): Produto {
    return new Produto({ ...input, id });
  }
}
