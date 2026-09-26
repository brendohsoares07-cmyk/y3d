import { BaseEntity } from "../entities/BaseEntity";
import { NotFoundError } from "../errors/AppError";
import { IRepository } from "../interfaces/IRepository";
import { Page } from "../types";

/**
 * Regras comuns de CRUD (SRP: só orquestra; validação fica na entidade).
 * Subclasses só precisam dizer como montar a entidade a partir da entrada.
 */
export abstract class CrudService<T extends BaseEntity, TInput> {
  protected constructor(
    protected readonly repository: IRepository<T>,
    private readonly mensagemNaoEncontrado: string,
  ) {}

  /** Cria a entidade (a validação acontece nos setters da própria entidade). */
  protected abstract build(input: TInput, id?: number): T | Promise<T>;

  list(page: number, limit: number): Promise<Page<T>> {
    return this.repository.findPage(page, limit);
  }

  get(id: number): Promise<T> {
    return this.getOrFail(id);
  }

  async create(input: TInput): Promise<T> {
    const entidade = await this.build(input);
    return this.repository.create(entidade);
  }

  async update(id: number, input: TInput): Promise<T> {
    await this.getOrFail(id); // não edita o que não existe
    const entidade = await this.build(input, id);
    await this.repository.update(entidade);
    return this.getOrFail(id);
  }

  async remove(id: number): Promise<void> {
    await this.getOrFail(id); // não deleta o que não existe
    await this.repository.delete(id);
  }

  protected async getOrFail(id: number): Promise<T> {
    const entidade = await this.repository.findById(id);
    if (!entidade) {
      throw new NotFoundError(this.mensagemNaoEncontrado);
    }
    return entidade;
  }
}
