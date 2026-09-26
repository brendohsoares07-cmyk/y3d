import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { BaseEntity } from "../entities/BaseEntity";
import { IRepository } from "../interfaces/IRepository";
import { Page } from "../types";

/**
 * CRUD genérico sobre MySQL. Um repositório novo só informa a tabela e
 * como converter uma linha do banco em entidade (aberto para extensão, OCP).
 */
export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected constructor(protected readonly table: string) {}

  protected abstract toEntity(row: RowDataPacket): T;

  /** Converte linhas em entidades. Repositórios com dados relacionados (ex.: itens do pedido) sobrescrevem. */
  protected async hydrate(rows: RowDataPacket[]): Promise<T[]> {
    return rows.map((row) => this.toEntity(row));
  }

  async findPage(page: number, limit: number): Promise<Page<T>> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    const [contagem] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM ${this.table}`);
    const total = Number(contagem[0].total);

    return {
      data: await this.hydrate(rows),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findById(id: number): Promise<T | null> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    const [entidade] = await this.hydrate(rows);
    return entidade ?? null;
  }

  async create(entity: T): Promise<T> {
    const [resultado] = await pool.query<ResultSetHeader>(`INSERT INTO ${this.table} SET ?`, [entity.toRow()]);
    const criado = await this.findById(resultado.insertId);
    if (!criado) throw new Error("Falha ao ler o registro recém-criado");
    return criado;
  }

  async update(entity: T): Promise<void> {
    await pool.query(`UPDATE ${this.table} SET ? WHERE id = ?`, [entity.toRow(), entity.id]);
  }

  async delete(id: number): Promise<void> {
    await pool.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}
