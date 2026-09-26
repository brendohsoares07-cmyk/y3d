import { RowDataPacket } from "mysql2";
import { ValidationError } from "../errors/AppError";
import { EntregaInput, Row } from "../types";
import { onlyDigits, requireText } from "../utils/validators";

/** Objeto de valor: endereço de entrega. Imutável e sempre válido. */
export class Entrega {
  private constructor(
    public readonly nome: string,
    public readonly telefone: string,
    public readonly cep: string,
    public readonly endereco: string,
    public readonly bairro: string,
    public readonly cidade: string,
  ) {}

  static criar(input: EntregaInput): Entrega {
    const telefone = onlyDigits(requireText(input.telefone, "telefone", 10, 20));
    const cep = onlyDigits(requireText(input.cep, "CEP", 8, 9));
    if (telefone.length < 10 || telefone.length > 11) throw new ValidationError("Telefone inválido");
    if (cep.length !== 8) throw new ValidationError("CEP inválido");

    return new Entrega(
      requireText(input.nome, "nome completo", 3, 120),
      telefone,
      cep,
      requireText(input.endereco, "endereço", 3, 160),
      requireText(input.bairro, "bairro", 2, 80),
      requireText(input.cidade, "cidade", 2, 80),
    );
  }

  /** Lê as colunas entrega_* de um pedido; null quando o pedido não tem endereço. */
  static fromRow(row: RowDataPacket): Entrega | null {
    if (row.entrega_nome === null) return null;
    return new Entrega(
      row.entrega_nome,
      row.entrega_telefone,
      row.entrega_cep,
      row.entrega_endereco,
      row.entrega_bairro,
      row.entrega_cidade,
    );
  }

  static rowVazia(): Row {
    return {
      entrega_nome: null,
      entrega_telefone: null,
      entrega_cep: null,
      entrega_endereco: null,
      entrega_bairro: null,
      entrega_cidade: null,
    };
  }

  toRow(): Row {
    return {
      entrega_nome: this.nome,
      entrega_telefone: this.telefone,
      entrega_cep: this.cep,
      entrega_endereco: this.endereco,
      entrega_bairro: this.bairro,
      entrega_cidade: this.cidade,
    };
  }

  toJSON(): Record<string, unknown> {
    return {
      nome: this.nome,
      telefone: this.telefone,
      cep: this.cep,
      endereco: this.endereco,
      bairro: this.bairro,
      cidade: this.cidade,
    };
  }
}
