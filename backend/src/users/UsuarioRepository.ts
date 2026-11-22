import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Usuario } from "./Usuario";
import { BaseRepository } from "../shared/base/BaseRepository";
import { IUsuarioRepository } from "./IUsuarioRepository";

export class UsuarioRepository extends BaseRepository<Usuario> implements IUsuarioRepository {
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
      foto: row.foto ?? null,
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

  async criarTokenRedefinicao(usuarioId: number, tokenHash: string): Promise<void> {
    await pool.execute("DELETE FROM password_reset_tokens WHERE usuario_id = ?", [usuarioId]);
    await pool.execute(
      "INSERT INTO password_reset_tokens (usuario_id, token_hash, expira_em) VALUES (?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 MINUTE))",
      [usuarioId, tokenHash],
    );
  }

  async buscarUsuarioPorTokenValido(tokenHash: string): Promise<number | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT usuario_id FROM password_reset_tokens WHERE token_hash = ? AND expira_em > CURRENT_TIMESTAMP LIMIT 1",
      [tokenHash],
    );
    return rows.length > 0 ? Number(rows[0].usuario_id) : null;
  }

  async removerTokenRedefinicao(usuarioId: number): Promise<void> {
    await pool.execute("DELETE FROM password_reset_tokens WHERE usuario_id = ?", [usuarioId]);
  }

  async atualizarSenhaHash(usuarioId: number, senhaHash: string): Promise<void> {
    await pool.execute("UPDATE usuarios SET senha_hash = ? WHERE id = ?", [senhaHash, usuarioId]);
  }

  async buscarFoto(usuarioId: number): Promise<string | null> {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT foto FROM usuarios WHERE id = ? LIMIT 1", [usuarioId]);
    return rows.length > 0 ? String(rows[0].foto ?? "") || null : null;
  }

  async atualizarFoto(usuarioId: number, foto: string): Promise<void> {
    await pool.execute("UPDATE usuarios SET foto = ? WHERE id = ?", [foto, usuarioId]);
  }
}
