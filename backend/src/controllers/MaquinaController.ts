import { Maquina } from "../entities/Maquina";
import { MaquinaService } from "../services/MaquinaService";
import { MaquinaInput } from "../types";
import { CrudController } from "./CrudController";

export class MaquinaController extends CrudController<Maquina, MaquinaInput> {
  constructor(service: MaquinaService) {
    super(service);
  }
}
