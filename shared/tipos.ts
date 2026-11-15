// Tipos compartilhados entre a API (server/) e o site (src/). Só tipos: nada aqui roda em tempo de execução.

export interface Categoria { nome: string; emoji: string }
export type Categorias = Record<string, Categoria>;

export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  avaliacao: number;
  num_avaliacoes: number;
  vendidos: number;
  cor1: string;
  cor2: string;
  emoji: string;
  imagem: string;
  imagens?: string[];
  formatos: string[];
  tamanho: string;
  descricao: string;
  /** Calculados pela API: só as fotos que existem de verdade, a principal e as miniaturas leves. */
  galeria: string[];
  imagemPrincipal: string;
  miniaturas: string[];
}

export interface Catalogo { categorias: Categorias; produtos: Produto[]; erro?: string }

export interface UsuarioPublico {
  id: number;
  nome: string;
  email: string;
  foto: string | null;
  loginEm: number;
  admin: boolean;
}

export interface AvaliacaoProduto {
  id: number;
  produto_id: number;
  usuario_id: number;
  nome: string;
  nota: number;
  comentario: string;
  criado_em: number;
}

export interface ItemPedido { id: number; nome: string; quantidade: number; preco: number }

export type StatusPedido = "aguardando" | "pago" | "enviado" | "entregue" | "cancelado";
export type FormaPagamento = "pix" | "cartao" | "boleto";

export interface AvaliacaoAtendimento { nota: number; comentario: string; criado_em: number }

export interface Pedido {
  id: number;
  usuario_id: number | null;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  pagamento: string;
  itens: ItemPedido[];
  total: number;
  status: StatusPedido;
  criado_em: number;
  pix_informado_em?: number;
  avaliacao_atendimento?: AvaliacaoAtendimento;
}

export interface Mensagem { id: number; nome: string; email: string; mensagem: string; lida: boolean; criado_em: number }

export interface ClienteAdmin {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  pedidos: number;
  gasto: number;
  cadastro: number;
  convidado: boolean;
}

export interface ProdutoAdmin { produto: Produto; vendidos: number; media: number; qtdAvaliacoes: number }

export interface PainelAdmin {
  pedidos: Pedido[];
  mensagens: Mensagem[];
  avaliacoes: AvaliacaoProduto[];
  clientes: ClienteAdmin[];
  receita: number;
  qtdPedidosValidos: number;
  ticketMedio: number;
  faturamento: { rotulo: string; valor: number }[];
  topClientes: ClienteAdmin[];
  mensagensNovas: number;
  pedidosAguardando: number;
  avaliacoesAtendimento: Pedido[];
  mediaAtendimento: number;
  produtos: ProdutoAdmin[];
  categorias: Categorias;
  catalogoErro: string | null;
}

export interface DadosCheckout {
  itens: { id: number; quantidade: number }[];
  nome: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  pagamento: string;
}

export interface RespostaCheckout { pedidoId: number; total: number; pagamento: string }

export interface FormularioProduto {
  nome: string;
  categoria: string;
  preco: string;
  imagem: string;
  emoji: string;
  tamanho: string;
  cor1: string;
  cor2: string;
  descricao: string;
}
