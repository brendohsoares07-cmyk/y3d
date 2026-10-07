export type Usuario = { id: number; nome: string; email: string; cpf: string; admin: boolean };

export type Page<T> = { data: T[]; page: number; limit: number; total: number; totalPages: number };

export type Categoria = { id: number; nome: string; descricao: string | null };
export type CategoriaInput = { nome: string; descricao: string | null };

export type Produto = {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  categoriaId: number;
  emoji: string | null;
  imagens: string[];
  personalizacoes: string[];
  detalhes: string[];
  avaliacao: number | null;
  totalAvaliacoes: number;
};
export type ProdutoInput = Omit<Produto, "id">;

export type TipoMaquina = "FDM" | "RESINA" | "FECHADA";
export type Maquina = { id: number; nome: string; tipo: TipoMaquina; volumeImpressao: string };
export type MaquinaInput = Omit<Maquina, "id">;

export type StatusPedido = "PENDENTE" | "PAGO" | "ENVIADO" | "ENTREGUE" | "CANCELADO";
export type FormaPagamento = "PIX" | "CARTAO" | "BOLETO";
export type Entrega = { nome: string; telefone: string; cep: string; endereco: string; bairro: string; cidade: string };
export type ItemPedido = { produtoId: number; quantidade: number; precoUnitario: number; personalizacao: string | null };
export type Pedido = {
  id: number;
  usuarioId: number;
  itens: ItemPedido[];
  frete: number;
  valorTotal: number;
  formaPagamento: FormaPagamento;
  status: StatusPedido;
  entrega: Entrega | null;
  criadoEm: string | null;
};
export type ItemPedidoInput = { produtoId: number; quantidade: number; personalizacao?: string | null };
/** Na criação vão os itens (e entrega/pagamento); na edição, só o status. */
export type PedidoInput = {
  itens: ItemPedidoInput[];
  formaPagamento?: FormaPagamento;
  entrega?: Entrega | null;
  status?: StatusPedido;
};

export type LoginResponse = { token: string; usuario: Usuario };
export type RegisterInput = { nome: string; email: string; cpf: string; senha: string };
export type UpdateUsuarioInput = { nome: string; cpf: string; senha: string };

export type StatusCliente = "ativo" | "inativo";
export type ClienteAdmin = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  pedidos: number;
  gasto: number;
  status: StatusCliente;
};
export type ResumoAdmin = {
  totalClientes: number;
  pedidos: number;
  receita: number;
  ticketMedio: number;
  faturamentoMensal: Array<{ mes: string; valor: number }>;
  topClientes: Array<{ id: number; nome: string; gasto: number }>;
};
