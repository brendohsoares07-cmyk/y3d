import type { ClienteAdmin, PainelAdmin, Pedido } from "../shared/tipos.js";
import { carregarCatalogo } from "./catalogo.js";
import { contasCarregar } from "./contas.js";
import { avaliacoesListar, mensagensListar, pedidosListar } from "./loja.js";
import { somenteDigitos } from "./validacoes.js";

const FUSO = "America/Sao_Paulo";
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** Ano e mês (1 a 12) de um instante, no fuso de São Paulo. */
function anoMes(segundos: number): { ano: number; mes: number } {
  const partes = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO, year: "numeric", month: "2-digit" }).formatToParts(new Date(segundos * 1000));
  return { ano: Number(partes.find((p) => p.type === "year")?.value), mes: Number(partes.find((p) => p.type === "month")?.value) };
}

const chaveMes = (ano: number, mes: number): string => `${ano}-${String(mes).padStart(2, "0")}`;
const maisNovosPrimeiro = <T extends { criado_em?: number }>(a: T, b: T): number => Number(b.criado_em ?? 0) - Number(a.criado_em ?? 0);

/** Reúne tudo o que as abas do painel admin mostram (mesmas contas do admin.php). */
export async function montarPainel(): Promise<PainelAdmin> {
  const [pedidosBrutos, mensagensBrutas, avaliacoesBrutas, contas, catalogo] = await Promise.all([
    pedidosListar(), mensagensListar(), avaliacoesListar(), contasCarregar(), carregarCatalogo(),
  ]);
  const pedidos = [...pedidosBrutos].sort(maisNovosPrimeiro);
  const mensagens = [...mensagensBrutas].sort(maisNovosPrimeiro);
  const avaliacoes = [...avaliacoesBrutas].sort(maisNovosPrimeiro);

  // Clientes = contas da loja (menos administradores) + quem comprou sem ter conta (agrupado pelo CPF)
  const clientes = new Map<string, ClienteAdmin>();
  for (const conta of contas) {
    if (conta.admin) continue;
    clientes.set(`u${Number(conta.id)}`, {
      nome: conta.nome ?? "", email: conta.email ?? "", cpf: somenteDigitos(String(conta.cpf ?? "")), telefone: "",
      pedidos: 0, gasto: 0, cadastro: Number(conta.criado_em ?? 0), convidado: false,
    });
  }
  const clientePorCpf = new Map<string, string>();
  for (const [chave, c] of clientes) if (c.cpf !== "") clientePorCpf.set(c.cpf, chave);

  for (const pedido of pedidos) {
    const cpfPedido = somenteDigitos(String(pedido.cpf ?? ""));
    let chave: string;
    if (pedido.usuario_id && clientes.has(`u${Number(pedido.usuario_id)}`)) {
      chave = `u${Number(pedido.usuario_id)}`;
    } else if (cpfPedido !== "" && clientePorCpf.has(cpfPedido)) {
      chave = clientePorCpf.get(cpfPedido)!;
    } else {
      chave = `c${cpfPedido !== "" ? cpfPedido : `pedido${Number(pedido.id)}`}`;
      if (!clientes.has(chave)) {
        clientes.set(chave, {
          nome: pedido.nome || "Cliente", email: pedido.email ?? "", cpf: cpfPedido, telefone: "",
          pedidos: 0, gasto: 0, cadastro: Number(pedido.criado_em ?? 0), convidado: true,
        });
      }
    }
    const cliente = clientes.get(chave)!;
    if (pedido.status !== "cancelado") {
      cliente.pedidos++;
      cliente.gasto += Number(pedido.total ?? 0);
    }
    // os pedidos estão do mais novo para o mais antigo: o primeiro telefone encontrado é o mais recente
    if (cliente.telefone === "" && String(pedido.telefone ?? "").trim() !== "") cliente.telefone = String(pedido.telefone).trim();
    if (cliente.cpf === "" && cpfPedido !== "") cliente.cpf = cpfPedido;
  }
  const listaClientes = [...clientes.values()].sort((a, b) => b.gasto - a.gasto || a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));

  // Números gerais (pedidos cancelados não entram na receita)
  const hoje = anoMes(Math.floor(Date.now() / 1000));
  const faturamento: { chave: string; rotulo: string; valor: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const indice = hoje.ano * 12 + (hoje.mes - 1) - i;
    const ano = Math.floor(indice / 12);
    const mes = (indice % 12) + 1;
    faturamento.push({ chave: chaveMes(ano, mes), rotulo: MESES[mes - 1], valor: 0 });
  }
  let receita = 0;
  let qtdPedidosValidos = 0;
  const vendidos = new Map<number, number>();
  for (const pedido of pedidos) {
    if (pedido.status === "cancelado") continue;
    const total = Number(pedido.total ?? 0);
    receita += total;
    qtdPedidosValidos++;
    const { ano, mes } = anoMes(Number(pedido.criado_em ?? 0));
    const mesDados = faturamento.find((f) => f.chave === chaveMes(ano, mes));
    if (mesDados) mesDados.valor += total;
    for (const item of pedido.itens ?? []) vendidos.set(Number(item.id), (vendidos.get(Number(item.id)) ?? 0) + Number(item.quantidade ?? 0));
  }

  const avaliacoesAtendimento = pedidos
    .filter((p): p is Pedido & { avaliacao_atendimento: NonNullable<Pedido["avaliacao_atendimento"]> } => !!p.avaliacao_atendimento)
    .sort((a, b) => Number(b.avaliacao_atendimento.criado_em ?? 0) - Number(a.avaliacao_atendimento.criado_em ?? 0));
  const mediaAtendimento = avaliacoesAtendimento.length
    ? Math.round((avaliacoesAtendimento.reduce((s, p) => s + Number(p.avaliacao_atendimento.nota), 0) / avaliacoesAtendimento.length) * 10) / 10
    : 0;

  const soma = new Map<number, number>();
  const qtd = new Map<number, number>();
  for (const av of avaliacoes) {
    soma.set(Number(av.produto_id), (soma.get(Number(av.produto_id)) ?? 0) + Number(av.nota));
    qtd.set(Number(av.produto_id), (qtd.get(Number(av.produto_id)) ?? 0) + 1);
  }

  return {
    pedidos, mensagens, avaliacoes,
    clientes: listaClientes,
    receita, qtdPedidosValidos,
    ticketMedio: qtdPedidosValidos > 0 ? receita / qtdPedidosValidos : 0,
    faturamento: faturamento.map(({ rotulo, valor }) => ({ rotulo, valor })),
    topClientes: listaClientes.filter((c) => c.gasto > 0).slice(0, 5),
    mensagensNovas: mensagens.filter((m) => !m.lida).length,
    pedidosAguardando: pedidos.filter((p) => p.status === "aguardando").length,
    avaliacoesAtendimento, mediaAtendimento,
    produtos: catalogo.produtos.map((produto) => {
      const q = qtd.get(produto.id) ?? 0;
      return { produto, vendidos: vendidos.get(produto.id) ?? 0, media: q > 0 ? Math.round(((soma.get(produto.id) ?? 0) / q) * 10) / 10 : 0, qtdAvaliacoes: q };
    }),
    categorias: catalogo.categorias,
    catalogoErro: catalogo.erro ?? null,
  };
}
