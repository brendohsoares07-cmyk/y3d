import { MaquinaInput, Row, TIPOS_MAQUINA, TipoMaquina } from "../types";
import { requireOneOf, requireText } from "../utils/validators";
import { BaseEntity } from "./BaseEntity";

/** Impressora 3D usada na produção da Y3D Creations. */
export class Maquina extends BaseEntity {
  private _nome = "";
  private _tipo: TipoMaquina = "FDM";
  private _volumeImpressao = "";

  constructor(props: MaquinaInput & { id?: number }) {
    super(props.id ?? 0);
    this.nome = props.nome;
    this.tipo = props.tipo;
    this.volumeImpressao = props.volumeImpressao;
  }

  get nome(): string {
    return this._nome;
  }
  set nome(valor: string) {
    this._nome = requireText(valor, "nome", 2, 80);
  }

  get tipo(): TipoMaquina {
    return this._tipo;
  }
  set tipo(valor: TipoMaquina) {
    this._tipo = requireOneOf(valor, "tipo", TIPOS_MAQUINA);
  }

  get volumeImpressao(): string {
    return this._volumeImpressao;
  }
  set volumeImpressao(valor: string) {
    this._volumeImpressao = requireText(valor, "volume de impressão", 3, 60);
  }

  toRow(): Row {
    return { nome: this._nome, tipo: this._tipo, volume_impressao: this._volumeImpressao };
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      nome: this._nome,
      tipo: this._tipo,
      volumeImpressao: this._volumeImpressao,
    };
  }
}
