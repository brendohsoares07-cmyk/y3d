import { Maquina } from "./Maquina";
import { MaquinaService } from "./MaquinaService";
import { MaquinaInput } from "../../shared/types";
import { CrudController } from "../../shared/base/CrudController";

export class MaquinaController extends CrudController<Maquina, MaquinaInput> {
  constructor(service: MaquinaService) {
    super(service);
  }
}
