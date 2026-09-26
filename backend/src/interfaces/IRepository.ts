import { BaseEntity } from "../entities/BaseEntity";
import { Pedido } from "../entities/Pedido";
import { Page } from "../types";

/** Contrato de persistência: os serviços dependem disto, não do MySQL (DIP). */
export interface IRepository<T extends BaseEntity> {
  findPage(page: number, limit: number): Promise<Page<T>>;
  findById(id: number): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<void>;
  delete(id: number): Promise<void>;
}

/** Pedidos também podem ser listados por dono. */
export interface IPedidoRepository extends IRepository<Pedido> {
  findPageByUsuario(usuarioId: number, page: number, limit: number): Promise<Page<Pedido>>;
}
