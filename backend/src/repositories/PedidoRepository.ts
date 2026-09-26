import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Entrega } from "../entities/Entrega";
import { Pedido } from "../entities/Pedido";
import { IPedidoRepository } from "../interfaces/IRepository";
import { ItemPedido, Page } from "../types";
import { BaseRepository } from "./BaseRepository";

export class PedidoRepository extends BaseRepository<Pedido> implements IPedidoRepository {
  constructor() {
    super("pedidos");
  }

  /** Um pedido só existe com seus itens; por isso tudo passa por hydrate(). */
  protected toEntity(): Pedido {
    throw new Error("Pedido depende dos seus itens: use hydrate()");
  }

  /** Carrega os itens de todos os pedidos de uma vez (sem uma consulta por pedido). */
  protected override async hydrate(rows: RowDataPacket[]): Promise<Pedido[]> {
    if (rows.length === 0) return [];

    const [linhasItens] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM pedido_itens WHERE pedido_id IN (?) ORDER BY id",
      [rows.map((r) => r.id)],
    );
    const itensPorPedido = new Map<number, ItemPedido[]>();
    for (const linha of linhasItens) {
      const lista = itensPorPedido.get(linha.pedido_id) ?? [];
      lista.push({
        produtoId: linha.produto_id,
        quantidade: linha.quantidade,
        precoUnitario: Number(linha.preco_unitario),
        personalizacao: linha.personalizacao,
      });
      itensPorPedido.set(linha.pedido_id, lista);
    }

    return rows.map(
      (row) =>
        new Pedido({
          id: row.id,
          usuarioId: row.usuario_id,
          itens: itensPorPedido.get(row.id) ?? [],
          frete: Number(row.frete),
          formaPagamento: row.forma_pagamento,
          entrega: Entrega.fromRow(row),
          status: row.status,
          criadoEm: row.criado_em,
        }),
    );
  }

  /** Grava o pedido e os itens na mesma transação: ou grava tudo ou nada. */
  override async create(pedido: Pedido): Promise<Pedido> {
    const conexao = await pool.getConnection();
    try {
      await conexao.beginTransaction();
      const [resultado] = await conexao.query<ResultSetHeader>("INSERT INTO pedidos SET ?", [pedido.toRow()]);
      const valores = pedido.itens.map((i) => [
        resultado.insertId,
        i.produtoId,
        i.quantidade,
        i.precoUnitario,
        i.personalizacao,
      ]);
      await conexao.query(
        "INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, personalizacao) VALUES ?",
        [valores],
      );
      await conexao.commit();

      const criado = await this.findById(resultado.insertId);
      if (!criado) throw new Error("Falha ao ler o pedido recém-criado");
      return criado;
    } catch (erro) {
      await conexao.rollback();
      throw erro;
    } finally {
      conexao.release();
    }
  }

  async findPageByUsuario(usuarioId: number, page: number, limit: number): Promise<Page<Pedido>> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",
      [usuarioId, limit, (page - 1) * limit],
    );
    const [contagem] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM pedidos WHERE usuario_id = ?",
      [usuarioId],
    );
    const total = Number(contagem[0].total);
    return {
      data: await this.hydrate(rows),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }
}
