import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { ClienteAdmin, FaturamentoMes, Page, StatusCliente, TopCliente } from "../types";
import { onlyDigits } from "../utils/validators";

/** Consultas de leitura (relatórios) do painel administrativo. Pedidos cancelados não contam. */
export class AdminRepository {
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
}
