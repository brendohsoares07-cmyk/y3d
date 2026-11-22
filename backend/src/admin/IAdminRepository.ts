import {
  AvaliacaoAtendimentoAdmin,
  AvaliacaoProdutoAdmin,
  ClienteAdmin,
  DispersaoCliente,
  FaixaPedido,
  MensagemAdmin,
  Page,
  ReceitaCategoria,
  StatusCliente,
  TopCliente,
} from "../shared/types";

export interface IAdminRepository {
  totais(): Promise<{ clientes: number; pedidos: number; receita: number }>;
  faturamentoDesde(inicio: string): Promise<Array<{ chave: string; valor: number }>>;
  topClientes(limite: number): Promise<TopCliente[]>;
  distribuicaoPedidos(): Promise<FaixaPedido[]>;
  dispersaoClientes(limite: number): Promise<DispersaoCliente[]>;
  receitaPorCategoria(): Promise<ReceitaCategoria[]>;
  clientes(page: number, limit: number, busca: string, status?: StatusCliente): Promise<Page<ClienteAdmin>>;
  avaliacoesAtendimento(): Promise<AvaliacaoAtendimentoAdmin[]>;
  avaliacoesProdutos(): Promise<AvaliacaoProdutoAdmin[]>;
  mensagens(): Promise<MensagemAdmin[]>;
  marcarMensagemLida(id: number): Promise<boolean>;
}
