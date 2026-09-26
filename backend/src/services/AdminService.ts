import { AdminRepository } from "../repositories/AdminRepository";
import { ClienteAdmin, Page, ResumoAdmin, StatusCliente } from "../types";

const ROTULOS_MES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MESES_NO_GRAFICO = 6;

export class AdminService {
  constructor(private readonly repository: AdminRepository) {}

  /** Dados do painel, na ordem da tela: KPIs → faturamento mensal → top clientes. */
  async dashboard(): Promise<ResumoAdmin> {
    const meses = this.ultimosMeses(MESES_NO_GRAFICO);
    const [totais, faturamento, topClientes] = await Promise.all([
      this.repository.totais(),
      this.repository.faturamentoDesde(`${meses[0].chave}-01 00:00:00`),
      this.repository.topClientes(5),
    ]);

    const valorPorMes = new Map(faturamento.map((f) => [f.chave, f.valor]));
    return {
      totalClientes: totais.clientes,
      pedidos: totais.pedidos,
      receita: totais.receita,
      ticketMedio: totais.pedidos > 0 ? Math.round((totais.receita / totais.pedidos) * 100) / 100 : 0,
      faturamentoMensal: meses.map((m) => ({ mes: m.rotulo, valor: valorPorMes.get(m.chave) ?? 0 })),
      topClientes,
    };
  }

  clientes(page: number, limit: number, busca: string, status?: StatusCliente): Promise<Page<ClienteAdmin>> {
    return this.repository.clientes(page, limit, busca.trim(), status);
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
