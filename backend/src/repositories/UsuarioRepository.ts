import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Usuario } from "../entities/Usuario";
import { BaseRepository } from "./BaseRepository";

export class UsuarioRepository extends BaseRepository<Usuario> {
  constructor() {
    super("usuarios");
  }

  protected toEntity(row: RowDataPacket): Usuario {
    return new Usuario({
      id: row.id,
      nome: row.nome,
      email: row.email,
      cpf: row.cpf,
      senhaHash: row.senha_hash,
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuarios WHERE email = ?", [email]);
    return rows.length > 0 ? this.toEntity(rows[0]) : null;
  }

  async findByCpf(cpf: string): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM usuarios WHERE cpf = ?", [cpf]);
    return rows.length > 0 ? this.toEntity(rows[0]) : null;
  }
}
