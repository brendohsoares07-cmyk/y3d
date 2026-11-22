import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { IAdminRepository } from "./IAdminRepository";
import {
  AvaliacaoAtendimentoAdmin,
  AvaliacaoProdutoAdmin,
  ClienteAdmin,
  DispersaoCliente,
  FaixaPedido,
  MensagemAdmin,
  Page,
  ReceitaCategoria,
  StatusCliente,
  TopCliente,
} from "../shared/types";
import { onlyDigits } from "../shared/validators/validators";

/** Consultas de leitura (relatórios) do painel administrativo. Pedidos cancelados não contam. */
export class AdminRepository implements IAdminRepository {
  async totais(): Promise<{ clientes: number; pedidos: number; receita: number }> {
    const [usuarios] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM usuarios");
    const [pedidos] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS pedidos, COALESCE(SUM(valor_total), 0) AS receita FROM pedidos WHERE status <> 'CANCELADO'",
    );
    return {
      clientes: Number(usuarios[0].total),
      pedidos: Number(pedidos[0].pedidos),
      receita: Number(pedidos[0].receita),
    };
  }

  /** Faturamento por mês (chave "AAAA-MM") desde a data de início. */
  async faturamentoDesde(inicio: string): Promise<Array<{ chave: string; valor: number }>> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(criado_em, '%Y-%m') AS chave, SUM(valor_total) AS valor
         FROM pedidos
        WHERE status <> 'CANCELADO' AND criado_em >= ?
        GROUP BY chave`,
      [inicio],
    );
    return rows.map((r) => ({ chave: String(r.chave), valor: Number(r.valor) }));
  }

  async topClientes(limite: number): Promise<TopCliente[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.id, u.nome, COALESCE(SUM(p.valor_total), 0) AS gasto
         FROM usuarios u
         LEFT JOIN pedidos p ON p.usuario_id = u.id AND p.status <> 'CANCELADO'
        GROUP BY u.id, u.nome
        ORDER BY gasto DESC, u.nome ASC
        LIMIT ?`,
      [limite],
    );
    return rows.map((r) => ({ id: r.id, nome: r.nome, gasto: Number(r.gasto) }));
  }

  async distribuicaoPedidos(): Promise<FaixaPedido[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT faixa, COUNT(*) AS quantidade
         FROM (
           SELECT CASE
                    WHEN valor_total < 50 THEN 'Até R$ 49'
                    WHEN valor_total < 100 THEN 'R$ 50–99'
                    WHEN valor_total < 250 THEN 'R$ 100–249'
                    WHEN valor_total < 500 THEN 'R$ 250–499'
                    ELSE 'R$ 500 ou mais'
                  END AS faixa,
                  CASE
                    WHEN valor_total < 50 THEN 1
                    WHEN valor_total < 100 THEN 2
                    WHEN valor_total < 250 THEN 3
                    WHEN valor_total < 500 THEN 4
                    ELSE 5
                  END AS ordem
             FROM pedidos
            WHERE status <> 'CANCELADO'
         ) pedidos_por_faixa
        GROUP BY faixa, ordem
        ORDER BY ordem`,
    );
    return rows.map((row) => ({ faixa: String(row.faixa), quantidade: Number(row.quantidade) }));
  }

  async dispersaoClientes(limite: number): Promise<DispersaoCliente[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.id, u.nome, COUNT(p.id) AS pedidos, COALESCE(SUM(p.valor_total), 0) AS gasto
         FROM usuarios u
         JOIN pedidos p ON p.usuario_id = u.id AND p.status <> 'CANCELADO'
        GROUP BY u.id, u.nome
        ORDER BY gasto DESC, pedidos DESC
        LIMIT ?`,
      [limite],
    );
    return rows.map((row) => ({
      id: Number(row.id),
      nome: String(row.nome),
      pedidos: Number(row.pedidos),
      gasto: Number(row.gasto),
    }));
  }

  async receitaPorCategoria(): Promise<ReceitaCategoria[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.nome AS categoria, COALESCE(vendas.receita, 0) AS receita
         FROM categorias c
         LEFT JOIN (
           SELECT p.categoria_id, SUM(i.preco_unitario * i.quantidade) AS receita
             FROM pedido_itens i
             JOIN pedidos pe ON pe.id = i.pedido_id AND pe.status <> 'CANCELADO'
             JOIN produtos p ON p.id = i.produto_id
            GROUP BY p.categoria_id
         ) vendas ON vendas.categoria_id = c.id
        ORDER BY receita DESC, c.nome ASC`,
    );
    return rows.map((row) => ({ categoria: String(row.categoria), receita: Number(row.receita) }));
  }

  async clientes(page: number, limit: number, busca: string, status?: StatusCliente): Promise<Page<ClienteAdmin>> {
    const params: Array<string | number> = [];
    let where = "";

    if (busca !== "") {
      const like = `%${busca.replace(/[\\%_]/g, "\\$&")}%`;
      const digitos = onlyDigits(busca);
      const condicoes = ["u.nome LIKE ?", "u.email LIKE ?"];
      params.push(like, like);
      if (digitos !== "") {
        condicoes.push("u.cpf LIKE ?");
        params.push(`%${digitos}%`);
      }
      where = `WHERE ${condicoes.join(" OR ")}`;
    }

    // "ativo" = já fez ao menos um pedido não cancelado
    const having =
      status === "ativo" ? "HAVING COUNT(p.id) > 0" : status === "inativo" ? "HAVING COUNT(p.id) = 0" : "";

    const consulta = `SELECT u.id, u.nome, u.cpf, u.email, COUNT(p.id) AS pedidos,
                             COALESCE(SUM(p.valor_total), 0) AS gasto
                        FROM usuarios u
                        LEFT JOIN pedidos p ON p.usuario_id = u.id AND p.status <> 'CANCELADO'
                        ${where}
                        GROUP BY u.id, u.nome, u.cpf, u.email
                        ${having}`;

    const [contagem] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM (${consulta}) t`, params);
    const total = Number(contagem[0].total);

    const [rows] = await pool.query<RowDataPacket[]>(`${consulta} ORDER BY u.nome ASC LIMIT ? OFFSET ?`, [
      ...params,
      limit,
      (page - 1) * limit,
    ]);

    return {
      data: rows.map((r) => ({
        id: r.id,
        nome: r.nome,
        cpf: r.cpf,
        email: r.email,
        pedidos: Number(r.pedidos),
        gasto: Number(r.gasto),
        status: Number(r.pedidos) > 0 ? "ativo" : "inativo",
      })),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async avaliacoesAtendimento(): Promise<AvaliacaoAtendimentoAdmin[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT a.id, a.pedido_id AS pedidoId, a.nota, a.comentario, a.criado_em AS criadoEm, u.nome, u.email FROM avaliacoes_atendimento a JOIN usuarios u ON u.id = a.usuario_id ORDER BY a.criado_em DESC",
    );
    return rows.map((row) => ({
      id: Number(row.id),
      pedidoId: Number(row.pedidoId),
      nota: Number(row.nota),
      comentario: String(row.comentario),
      criadoEm: row.criadoEm instanceof Date ? row.criadoEm.toISOString() : String(row.criadoEm),
      nome: String(row.nome),
      email: String(row.email),
    }));
  }

  async avaliacoesProdutos(): Promise<AvaliacaoProdutoAdmin[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT a.id, a.produto_id AS produtoId, p.nome AS produto, a.usuario_nome AS nome, a.nota, a.comentario, a.criado_em AS criadoEm FROM avaliacoes_produtos a JOIN produtos p ON p.id = a.produto_id ORDER BY a.criado_em DESC",
    );
    return rows.map((row) => ({
      id: Number(row.id),
      produtoId: Number(row.produtoId),
      produto: String(row.produto),
      nome: String(row.nome),
      nota: Number(row.nota),
      comentario: String(row.comentario),
      criadoEm: row.criadoEm instanceof Date ? row.criadoEm.toISOString() : String(row.criadoEm),
    }));
  }

  async mensagens(): Promise<MensagemAdmin[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, nome, email, mensagem, lida, criado_em AS criadoEm FROM mensagens ORDER BY criado_em DESC",
    );
    return rows.map((row) => ({
      id: Number(row.id),
      nome: String(row.nome),
      email: String(row.email),
      mensagem: String(row.mensagem),
      lida: Number(row.lida),
      criadoEm: row.criadoEm instanceof Date ? row.criadoEm.toISOString() : String(row.criadoEm),
    }));
  }

  async marcarMensagemLida(id: number): Promise<boolean> {
    const [resultado] = await pool.execute<ResultSetHeader>("UPDATE mensagens SET lida = 1 WHERE id = ?", [id]);
    return resultado.affectedRows > 0;
  }
}
