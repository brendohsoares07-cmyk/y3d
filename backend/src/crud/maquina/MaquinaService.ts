import { Maquina } from "./Maquina";
import { IRepository } from "../../shared/base/IRepository";
import { MaquinaInput } from "../../shared/types";
import { CrudService } from "../../shared/base/CrudService";

export class MaquinaService extends CrudService<Maquina, MaquinaInput> {
  constructor(repository: IRepository<Maquina>) {
    super(repository, "Máquina não encontrada");
  }

  protected build(input: MaquinaInput, id?: number): Maquina {
    return new Maquina({ ...input, id });
  }
}
