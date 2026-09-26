import { RowDataPacket } from "mysql2";
import { Maquina } from "../entities/Maquina";
import { BaseRepository } from "./BaseRepository";

export class MaquinaRepository extends BaseRepository<Maquina> {
  constructor() {
    super("maquinas");
  }

  protected toEntity(row: RowDataPacket): Maquina {
    return new Maquina({
      id: row.id,
      nome: row.nome,
      tipo: row.tipo,
      volumeImpressao: row.volume_impressao,
    });
  }
}
