import { RowDataPacket } from "mysql2";
import { Categoria } from "./Categoria";
import { BaseRepository } from "../../shared/base/BaseRepository";

export class CategoriaRepository extends BaseRepository<Categoria> {
  constructor() {
    super("categorias");
  }

  protected toEntity(row: RowDataPacket): Categoria {
    return new Categoria({ id: row.id, nome: row.nome, descricao: row.descricao });
  }
}
