import { Row } from "../types";

/**
 * Classe abstrata de todas as entidades do domínio.
 * Cada entidade concreta implementa (polimorfismo) como é gravada no banco
 * e como é exposta na API.
 */
export abstract class BaseEntity {
  private readonly _id: number;

  protected constructor(id: number) {
    this._id = id;
  }

  get id(): number {
    return this._id;
  }

  /** Colunas gravadas no banco. */
  abstract toRow(): Row;

  /** Representação pública devolvida pela API (JSON.stringify usa este método). */
  abstract toJSON(): Record<string, unknown>;
}
