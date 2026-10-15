import { CategoriaInput, Row } from "../../shared/types";
import { optionalText, requireText } from "../../shared/validators/validators";
import { BaseEntity } from "../../shared/base/BaseEntity";

export class Categoria extends BaseEntity {
  private _nome = "";
  public readonly descricao: string | null;

  constructor(props: CategoriaInput & { id?: number }) {
    super(props.id ?? 0);
    this.nome = props.nome;
    this.descricao = optionalText(props.descricao);
  }

  get nome(): string {
    return this._nome;
  }

  set nome(valor: string) {
    this._nome = requireText(valor, "nome", 2, 80);
  }

  toRow(): Row {
    return { nome: this._nome, descricao: this.descricao };
  }

  toJSON(): Record<string, unknown> {
    return { id: this.id, nome: this._nome, descricao: this.descricao };
  }
}
