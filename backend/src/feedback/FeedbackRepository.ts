import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { AvaliacaoProdutoPublica } from "../shared/types";
import { IFeedbackRepository } from "./IFeedbackRepository";

export class FeedbackRepository implements IFeedbackRepository {
  async avaliacoesProduto(produtoId: number): Promise<AvaliacaoProdutoPublica[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id, usuario_nome AS nome, nota, comentario, criado_em AS criadoEm FROM avaliacoes_produtos WHERE produto_id = ? ORDER BY criado_em DESC",
      [produtoId],
    );
    return rows.map((row) => ({
      id: Number(row.id),
      nome: String(row.nome),
      nota: Number(row.nota),
      comentario: String(row.comentario),
      criadoEm: row.criadoEm instanceof Date ? row.criadoEm.toISOString() : String(row.criadoEm),
    }));
  }

  async nomeUsuario(usuarioId: number): Promise<string | null> {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT nome FROM usuarios WHERE id = ? LIMIT 1", [usuarioId]);
    return rows.length > 0 ? String(rows[0].nome) : null;
  }

  async salvarAvaliacaoProduto(
    produtoId: number,
    usuarioId: number,
    nomeUsuario: string,
    nota: number,
    comentario: string,
  ): Promise<void> {
    await pool.execute(
      "INSERT INTO avaliacoes_produtos (produto_id, usuario_id, usuario_nome, nota, comentario) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE usuario_nome = VALUES(usuario_nome), nota = VALUES(nota), comentario = VALUES(comentario), criado_em = CURRENT_TIMESTAMP",
      [produtoId, usuarioId, nomeUsuario, nota, comentario],
    );
    const [media] = await pool.execute<RowDataPacket[]>(
      "SELECT AVG(nota) AS avaliacao, COUNT(*) AS total FROM avaliacoes_produtos WHERE produto_id = ?",
      [produtoId],
    );
    await pool.execute("UPDATE produtos SET avaliacao = ?, total_avaliacoes = ? WHERE id = ?", [
      media[0].avaliacao,
      media[0].total,
      produtoId,
    ]);
  }

  async pedidoEntregue(pedidoId: number, usuarioId: number): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM pedidos WHERE id = ? AND usuario_id = ? AND status = 'ENTREGUE' LIMIT 1",
      [pedidoId, usuarioId],
    );
    return rows.length > 0;
  }

  async salvarAvaliacaoAtendimento(
    pedidoId: number,
    usuarioId: number,
    nota: number,
    comentario: string,
  ): Promise<void> {
    await pool.execute(
      "INSERT INTO avaliacoes_atendimento (pedido_id, usuario_id, nota, comentario) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nota=VALUES(nota), comentario=VALUES(comentario), criado_em=CURRENT_TIMESTAMP",
      [pedidoId, usuarioId, nota, comentario],
    );
  }
}
