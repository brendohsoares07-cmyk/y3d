import { ProdutoInput, Row } from "../types";
import {
  optionalText,
  requireInt,
  requirePositiveMoney,
  requireStringList,
  requireText,
} from "../utils/validators";
import { ValidationError } from "../errors/AppError";
import { BaseEntity } from "./BaseEntity";

export class Produto extends BaseEntity {
  private _nome = "";
  private _preco = 0;
  private _estoque = 0;
  private _categoriaId = 0;
  private _avaliacao: number | null = null;
  private _totalAvaliacoes = 0;
  public readonly descricao: string | null;
  public readonly emoji: string | null;
  public readonly imagens: readonly string[];
  public readonly personalizacoes: readonly string[];
  public readonly detalhes: readonly string[];

  constructor(props: ProdutoInput & { id?: number }) {
    super(props.id ?? 0);
    this.nome = props.nome;
    this.preco = props.preco;
    this.estoque = props.estoque;
    this.categoriaId = props.categoriaId;
    this.avaliacao = props.avaliacao ?? null;
    this.totalAvaliacoes = props.totalAvaliacoes ?? 0;
    this.descricao = optionalText(props.descricao);
    this.emoji = optionalText(props.emoji, 16);
    this.imagens = requireStringList(props.imagens, "imagens", 10);
    this.personalizacoes = requireStringList(props.personalizacoes, "personalizações", 10, 80);
    this.detalhes = requireStringList(props.detalhes, "detalhes", 15);
  }

  get nome(): string {
    return this._nome;
  }
  set nome(valor: string) {
    this._nome = requireText(valor, "nome", 2, 120);
  }

  get preco(): number {
    return this._preco;
  }
  set preco(valor: number) {
    this._preco = requirePositiveMoney(valor, "preço"); // arredonda em 2 casas
  }

  get estoque(): number {
    return this._estoque;
  }
  set estoque(valor: number) {
    this._estoque = requireInt(valor, "estoque", 0, 1_000_000);
  }

  get categoriaId(): number {
    return this._categoriaId;
  }
  set categoriaId(valor: number) {
    this._categoriaId = requireInt(valor, "categoriaId", 1);
  }

  get avaliacao(): number | null {
    return this._avaliacao;
  }
  set avaliacao(valor: number | null) {
    if (valor === null) {
      this._avaliacao = null;
      return;
    }
    const nota = Number(valor);
    if (!Number.isFinite(nota) || nota < 0 || nota > 5) {
      throw new ValidationError("A avaliação deve estar entre 0 e 5");
    }
    this._avaliacao = Math.round(nota * 10) / 10;
  }

  get totalAvaliacoes(): number {
    return this._totalAvaliacoes;
  }
  set totalAvaliacoes(valor: number) {
    this._totalAvaliacoes = requireInt(valor, "total de avaliações", 0, 10_000_000);
  }

  toRow(): Row {
    return {
      nome: this._nome,
      descricao: this.descricao,
      preco: this._preco,
      estoque: this._estoque,
      categoria_id: this._categoriaId,
      emoji: this.emoji,
      imagens: JSON.stringify(this.imagens),
      personalizacoes: JSON.stringify(this.personalizacoes),
      detalhes: JSON.stringify(this.detalhes),
      avaliacao: this._avaliacao,
      total_avaliacoes: this._totalAvaliacoes,
    };
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      nome: this._nome,
      descricao: this.descricao,
      preco: this._preco,
      estoque: this._estoque,
      categoriaId: this._categoriaId,
      emoji: this.emoji,
      imagens: this.imagens,
      personalizacoes: this.personalizacoes,
      detalhes: this.detalhes,
      avaliacao: this._avaliacao,
      totalAvaliacoes: this._totalAvaliacoes,
    };
  }
}
