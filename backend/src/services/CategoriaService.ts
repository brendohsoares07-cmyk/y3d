import { Categoria } from "../entities/Categoria";
import { IRepository } from "../interfaces/IRepository";
import { CategoriaInput } from "../types";
import { CrudService } from "./CrudService";

export class CategoriaService extends CrudService<Categoria, CategoriaInput> {
  constructor(repository: IRepository<Categoria>) {
    super(repository, "Categoria não encontrada");
  }

  protected build(input: CategoriaInput, id?: number): Categoria {
    return new Categoria({ ...input, id });
  }
}
