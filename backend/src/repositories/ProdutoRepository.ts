import { RowDataPacket } from "mysql2";
import { Produto } from "../entities/Produto";
import { parseJsonList } from "../utils/validators";
import { BaseRepository } from "./BaseRepository";

export class ProdutoRepository extends BaseRepository<Produto> {
  constructor() {
    super("produtos");
  }

  protected toEntity(row: RowDataPacket): Produto {
    return new Produto({
      id: row.id,
      nome: row.nome,
      descricao: row.descricao,
      preco: Number(row.preco),
      estoque: row.estoque,
      categoriaId: row.categoria_id,
      emoji: row.emoji,
      imagens: parseJsonList(row.imagens),
      personalizacoes: parseJsonList(row.personalizacoes),
      detalhes: parseJsonList(row.detalhes),
      avaliacao: row.avaliacao === null ? null : Number(row.avaliacao),
      totalAvaliacoes: row.total_avaliacoes,
    });
  }
}
