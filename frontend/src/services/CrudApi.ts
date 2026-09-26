import { Page } from "../types";
import { request } from "./http";

/** Contrato usado pelas listagens (só o que elas precisam). */
export interface ListableApi<T> {
  list(page: number, limit?: number): Promise<Page<T>>;
  remove(id: number): Promise<void>;
}

/** Cliente REST genérico: uma instância por recurso da API. */
export class CrudApi<T, TInput> implements ListableApi<T> {
  constructor(private readonly resource: string) {}

  list(page: number, limit = 10): Promise<Page<T>> {
    return request<Page<T>>(`/${this.resource}?page=${page}&limit=${limit}`);
  }

  get(id: number): Promise<T> {
    return request<T>(`/${this.resource}/${id}`);
  }

  create(input: TInput): Promise<T> {
    return request<T>(`/${this.resource}`, { method: "POST", body: input });
  }

  update(id: number, input: TInput): Promise<T> {
    return request<T>(`/${this.resource}/${id}`, { method: "PUT", body: input });
  }

  remove(id: number): Promise<void> {
    return request<void>(`/${this.resource}/${id}`, { method: "DELETE" });
  }
}
