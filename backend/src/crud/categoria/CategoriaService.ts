import { Categoria } from "./Categoria";
import { IRepository } from "../../shared/base/IRepository";
import { CategoriaInput } from "../../shared/types";
import { CrudService } from "../../shared/base/CrudService";

export class CategoriaService extends CrudService<Categoria, CategoriaInput> {
  constructor(repository: IRepository<Categoria>) {
    super(repository, "Categoria não encontrada");
  }

  protected build(input: CategoriaInput, id?: number): Categoria {
    return new Categoria({ ...input, id });
  }
}
