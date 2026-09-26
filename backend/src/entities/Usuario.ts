import { ValidationError } from "../errors/AppError";
import { Row } from "../types";
import { isCpf, isEmail, onlyDigits, requireText } from "../utils/validators";
import { BaseEntity } from "./BaseEntity";

export type UsuarioProps = {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  senhaHash: string;
};

export class Usuario extends BaseEntity {
  private _nome = "";
  private _email = "";
  private _cpf = "";
  /** Só o hash bcrypt é guardado; a senha em texto nunca entra na entidade. */
  public readonly senhaHash: string;

  constructor(props: UsuarioProps) {
    super(props.id ?? 0);
    this.nome = props.nome;
    this.email = props.email;
    this.cpf = props.cpf;
    this.senhaHash = props.senhaHash;
  }

  get nome(): string {
    return this._nome;
  }
  set nome(valor: string) {
    this._nome = requireText(valor, "nome", 3, 120);
  }

  get email(): string {
    return this._email;
  }
  set email(valor: string) {
    const email = requireText(valor, "e-mail", 5, 160).toLowerCase();
    if (!isEmail(email)) throw new ValidationError("E-mail inválido");
    this._email = email;
  }

  get cpf(): string {
    return this._cpf;
  }
  set cpf(valor: string) {
    const cpf = onlyDigits(requireText(valor, "CPF", 11, 14));
    if (!isCpf(cpf)) throw new ValidationError("CPF inválido");
    this._cpf = cpf; // guardado só com dígitos
  }

  toRow(): Row {
    return { nome: this._nome, email: this._email, cpf: this._cpf, senha_hash: this.senhaHash };
  }

  /** Nunca inclui o hash da senha. */
  toJSON(): Record<string, unknown> {
    return { id: this.id, nome: this._nome, email: this._email, cpf: this._cpf };
  }
}
