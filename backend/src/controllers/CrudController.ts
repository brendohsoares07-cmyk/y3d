import { Request, Response } from "express";
import { BaseEntity } from "../entities/BaseEntity";
import { CrudService } from "../services/CrudService";
import { parseId, parsePagination } from "../utils/http";

/** Handlers HTTP genéricos. Controllers específicos só sobrescrevem o que muda. */
export abstract class CrudController<T extends BaseEntity, TInput> {
  protected constructor(protected readonly service: CrudService<T, TInput>) {}

  /** Monta a entrada do serviço a partir da requisição (padrão: o corpo). */
  protected buildInput(req: Request): TInput {
    return req.body as TInput;
  }

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req);
    res.json(await this.service.list(page, limit));
  };

  get = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.service.get(parseId(req.params.id)));
  };

  create = async (req: Request, res: Response): Promise<void> => {
    res.status(201).json(await this.service.create(this.buildInput(req)));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.service.update(parseId(req.params.id), this.buildInput(req)));
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.service.remove(parseId(req.params.id));
    res.status(204).send();
  };
}
