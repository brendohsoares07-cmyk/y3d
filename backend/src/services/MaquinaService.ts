import { Maquina } from "../entities/Maquina";
import { IRepository } from "../interfaces/IRepository";
import { MaquinaInput } from "../types";
import { CrudService } from "./CrudService";

export class MaquinaService extends CrudService<Maquina, MaquinaInput> {
  constructor(repository: IRepository<Maquina>) {
    super(repository, "Máquina não encontrada");
  }

  protected build(input: MaquinaInput, id?: number): Maquina {
    return new Maquina({ ...input, id });
  }
}
