import {
  Categoria,
  ClienteAdmin,
  CategoriaInput,
  LoginResponse,
  Maquina,
  MaquinaInput,
  Page,
  Pedido,
  PedidoInput,
  Produto,
  ProdutoInput,
  RegisterInput,
  ResumoAdmin,
  StatusCliente,
  UpdateUsuarioInput,
  Usuario,
} from "../types";
import { CrudApi, ListableApi } from "./CrudApi";
import { request } from "./apiClient";

export const categoriasApi = new CrudApi<Categoria, CategoriaInput>("categorias");
export const produtosApi = new CrudApi<Produto, ProdutoInput>("produtos");
export const maquinasApi = new CrudApi<Maquina, MaquinaInput>("maquinas");
export const pedidosApi = new CrudApi<Pedido, PedidoInput>("pedidos");

function catalogoPaginado<T>(recurso: string): Pick<ListableApi<T>, "list"> {
  return {
    list: (page, limit = 100) => {
      const query = new URLSearchParams({ page: String(page), limit: String(limit) });
      return request<Page<T>>(`/${recurso}?${query.toString()}`);
    },
  };
}

export const catalogoApi = {
  categorias: catalogoPaginado<Categoria>("catalogo/categorias"),
  produtos: {
    ...catalogoPaginado<Produto>("catalogo/produtos"),
    get: (id: number) => request<Produto>(`/catalogo/produtos/${id}`),
  },
};

export const authApi = {
  login: (email: string, senha: string) =>
    request<LoginResponse>("/auth/login", { method: "POST", body: { email, senha } }),
  register: (input: RegisterInput) => request<Usuario>("/auth/register", { method: "POST", body: input }),
  me: () => request<Usuario>("/usuarios/me"),
  updateUsuario: (id: number, input: UpdateUsuarioInput) =>
    request<Usuario>(`/usuarios/${id}`, { method: "PUT", body: input }),
};

type FiltroClientes = { page: number; limit?: number; busca?: string; status?: StatusCliente | "" };

export const adminApi = {
  resumo: () => request<ResumoAdmin>("/admin/dashboard"),
  clientes: ({ page, limit = 8, busca, status }: FiltroClientes) => {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (busca) query.set("busca", busca);
    if (status) query.set("status", status);
    return request<Page<ClienteAdmin>>(`/admin/clientes?${query.toString()}`);
  },
};
