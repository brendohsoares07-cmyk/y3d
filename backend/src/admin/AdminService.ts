import { IAdminRepository } from "./IAdminRepository";
import { ClienteAdmin, Page, ResumoAdmin, StatusCliente } from "../shared/types";
import { linearRegression } from "./linearRegression";
import { NotFoundError, ValidationError } from "../errors/AppError";

const ROTULOS_MES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MESES_NO_GRAFICO = 6;
const FAIXAS_PEDIDO = ["Até R$ 49", "R$ 50–99", "R$ 100–249", "R$ 250–499", "R$ 500 ou mais"];
const MAX_PONTOS_DISPERSAO = 100;

export class AdminService {
  constructor(private readonly repository: IAdminRepository) {}

  /** Dados do painel, na ordem da tela: KPIs → faturamento mensal → top clientes. */
  async dashboard(): Promise<ResumoAdmin> {
    const meses = this.ultimosMeses(MESES_NO_GRAFICO);
    const [totais, faturamento, topClientes, distribuicaoPedidos, dispersaoClientes, receitaPorCategoria] =
      await Promise.all([
        this.repository.totais(),
        this.repository.faturamentoDesde(`${meses[0].chave}-01 00:00:00`),
        this.repository.topClientes(5),
        this.repository.distribuicaoPedidos(),
        this.repository.dispersaoClientes(MAX_PONTOS_DISPERSAO),
        this.repository.receitaPorCategoria(),
      ]);

    const valorPorMes = new Map(faturamento.map((f) => [f.chave, f.valor]));
    const valoresMensais = meses.map((mes) => valorPorMes.get(mes.chave) ?? 0);
    const tendencias = linearRegression(valoresMensais);
    const quantidadePorFaixa = new Map(distribuicaoPedidos.map((faixa) => [faixa.faixa, faixa.quantidade]));
    return {
      totalClientes: totais.clientes,
      pedidos: totais.pedidos,
      receita: totais.receita,
      ticketMedio: totais.pedidos > 0 ? Math.round((totais.receita / totais.pedidos) * 100) / 100 : 0,
      faturamentoMensal: meses.map((m, indice) => ({
        mes: m.rotulo,
        valor: valoresMensais[indice],
        tendencia: tendencias[indice],
      })),
      distribuicaoPedidos: FAIXAS_PEDIDO.map((faixa) => ({
        faixa,
        quantidade: quantidadePorFaixa.get(faixa) ?? 0,
      })),
      dispersaoClientes,
      receitaPorCategoria,
      topClientes,
    };
  }

  clientes(page: number, limit: number, busca: string, status?: StatusCliente): Promise<Page<ClienteAdmin>> {
    return this.repository.clientes(page, limit, busca.trim(), status);
  }

  avaliacoesAtendimento() {
    return this.repository.avaliacoesAtendimento();
  }

  avaliacoesProdutos() {
    return this.repository.avaliacoesProdutos();
  }

  mensagens() {
    return this.repository.mensagens();
  }

  async marcarMensagemLida(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) throw new ValidationError("Mensagem inválida.");
    if (!(await this.repository.marcarMensagemLida(id))) throw new NotFoundError("Mensagem não encontrada.");
  }

  private ultimosMeses(quantidade: number): Array<{ chave: string; rotulo: string }> {
    const hoje = new Date();
    const meses: Array<{ chave: string; rotulo: string }> = [];
    for (let i = quantidade - 1; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      meses.push({ chave: `${data.getFullYear()}-${mes}`, rotulo: ROTULOS_MES[data.getMonth()] });
    }
    return meses;
  }
}
