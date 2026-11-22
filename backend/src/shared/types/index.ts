/** Linha pronta para gravar no banco (colunas em snake_case). */
export type Row = Record<string, string | number | null>;

export type Page<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TipoMaquina = "FDM" | "RESINA" | "FECHADA";
export const TIPOS_MAQUINA: readonly TipoMaquina[] = ["FDM", "RESINA", "FECHADA"];

export type StatusPedido = "PENDENTE" | "PAGO" | "ENVIADO" | "ENTREGUE" | "CANCELADO";
export const STATUS_PEDIDO: readonly StatusPedido[] = ["PENDENTE", "PAGO", "ENVIADO", "ENTREGUE", "CANCELADO"];

export type FormaPagamento = "PIX" | "CARTAO" | "BOLETO";
export const FORMAS_PAGAMENTO: readonly FormaPagamento[] = ["PIX", "CARTAO", "BOLETO"];

export type CategoriaInput = { nome: string; descricao?: string | null };
export type ProdutoInput = {
  nome: string;
  descricao?: string | null;
  preco: number;
  estoque: number;
  categoriaId: number;
  emoji?: string | null;
  imagens?: string[];
  personalizacoes?: string[];
  detalhes?: string[];
  avaliacao?: number | null;
  totalAvaliacoes?: number;
  cor1?: string | null;
  cor2?: string | null;
  formatos?: string[];
  tamanho?: string | null;
  vendidos?: number;
};
export type MaquinaInput = { nome: string; tipo: TipoMaquina; volumeImpressao: string };
export type EntregaInput = {
  nome: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
};
export type ItemPedidoInput = { produtoId: number; quantidade: number; personalizacao?: string | null };
/** Item já gravado no pedido: o preço fica congelado no momento da compra. */
export type ItemPedido = { produtoId: number; quantidade: number; precoUnitario: number; personalizacao: string | null };
export type PedidoInput = {
  usuarioId: number;
  itens: ItemPedidoInput[];
  formaPagamento?: FormaPagamento;
  entrega?: EntregaInput | null;
  status?: StatusPedido;
};

export type RegisterInput = { nome: string; email: string; cpf: string; senha: string };
export type LoginInput = { email: string; senha: string };
export type UpdateUsuarioInput = { nome: string; cpf: string; senha: string; email?: string };

export type StatusCliente = "ativo" | "inativo";
export type UsuarioPerfil = Record<string, unknown> & { admin: boolean };

export type ClienteAdmin = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  pedidos: number;
  gasto: number;
  status: StatusCliente;
};
export type FaturamentoMes = { mes: string; valor: number; tendencia: number };
export type FaixaPedido = { faixa: string; quantidade: number };
export type DispersaoCliente = { id: number; nome: string; pedidos: number; gasto: number };
export type ReceitaCategoria = { categoria: string; receita: number };
export type TopCliente = { id: number; nome: string; gasto: number };
export type AvaliacaoProdutoPublica = {
  id: number;
  nome: string;
  nota: number;
  comentario: string;
  criadoEm: string;
};
export type AvaliacaoAtendimentoAdmin = {
  id: number;
  pedidoId: number;
  nota: number;
  comentario: string;
  criadoEm: string;
  nome: string;
  email: string;
};
export type AvaliacaoProdutoAdmin = {
  id: number;
  produtoId: number;
  produto: string;
  nome: string;
  nota: number;
  comentario: string;
  criadoEm: string;
};
export type MensagemAdmin = {
  id: number;
  nome: string;
  email: string;
  mensagem: string;
  lida: number;
  criadoEm: string;
};
export type ResumoAdmin = {
  totalClientes: number;
  pedidos: number;
  receita: number;
  ticketMedio: number;
  faturamentoMensal: FaturamentoMes[];
  distribuicaoPedidos: FaixaPedido[];
  dispersaoClientes: DispersaoCliente[];
  receitaPorCategoria: ReceitaCategoria[];
  topClientes: TopCliente[];
};
