import { FORMAS_PAGAMENTO, FormaPagamento, ItemPedido, Row, STATUS_PEDIDO, StatusPedido } from "../types";
import { ValidationError } from "../errors/AppError";
import { requireInt, requireOneOf, requirePositiveMoney } from "../utils/validators";
import { BaseEntity } from "./BaseEntity";
import { Entrega } from "./Entrega";

export type PedidoProps = {
  id?: number;
  usuarioId: number;
  itens: ItemPedido[];
  frete: number;
  formaPagamento?: FormaPagamento;
  entrega?: Entrega | null;
  status?: StatusPedido;
  criadoEm?: Date | null;
};

/** Pedido de um usuário com um ou mais itens. O total é sempre calculado (itens + frete). */
export class Pedido extends BaseEntity {
  private _status: StatusPedido = "PENDENTE";
  private _formaPagamento: FormaPagamento = "PIX";
  public readonly usuarioId: number;
  public readonly itens: readonly ItemPedido[];
  public readonly frete: number;
  public readonly entrega: Entrega | null;
  public readonly criadoEm: Date | null;

  constructor(props: PedidoProps) {
    super(props.id ?? 0);
    this.usuarioId = requireInt(props.usuarioId, "usuarioId", 1);
    if (props.itens.length === 0) throw new ValidationError("O pedido precisa ter ao menos um item");
    this.itens = props.itens.map((item) => ({
      produtoId: requireInt(item.produtoId, "produtoId", 1),
      quantidade: requireInt(item.quantidade, "quantidade", 1, 1000),
      precoUnitario: requirePositiveMoney(item.precoUnitario, "preço"),
      personalizacao: item.personalizacao,
    }));
    this.frete = Math.max(0, Math.round(props.frete * 100) / 100);
    this.entrega = props.entrega ?? null;
    this.criadoEm = props.criadoEm ?? null;
    this.formaPagamento = props.formaPagamento ?? "PIX";
    this.status = props.status ?? "PENDENTE";
  }

  get status(): StatusPedido {
    return this._status;
  }
  set status(valor: StatusPedido) {
    this._status = requireOneOf(valor, "status", STATUS_PEDIDO);
  }

  get formaPagamento(): FormaPagamento {
    return this._formaPagamento;
  }
  set formaPagamento(valor: FormaPagamento) {
    this._formaPagamento = requireOneOf(valor, "forma de pagamento", FORMAS_PAGAMENTO);
  }

  /** Soma dos itens + frete, arredondado em 2 casas. */
  get valorTotal(): number {
    const itens = this.itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0);
    return Math.round((itens + this.frete) * 100) / 100;
  }

  toRow(): Row {
    return {
      usuario_id: this.usuarioId,
      status: this._status,
      forma_pagamento: this._formaPagamento,
      frete: this.frete,
      valor_total: this.valorTotal,
      ...(this.entrega ? this.entrega.toRow() : Entrega.rowVazia()),
    };
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      itens: this.itens,
      frete: this.frete,
      valorTotal: this.valorTotal,
      formaPagamento: this._formaPagamento,
      status: this._status,
      entrega: this.entrega,
      criadoEm: this.criadoEm ? this.criadoEm.toISOString() : null,
    };
  }
}
