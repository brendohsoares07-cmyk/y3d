import { Router } from "express";
import type { DadosCheckout, RespostaCheckout } from "../../shared/tipos.js";
import { carregarCatalogo, produtoPorId } from "../catalogo.js";
import { EMAIL_SUPORTE } from "../config.js";
import { enviarEmail } from "../email.js";
import {
  avaliacaoSalvar, avaliacoesDoProduto, mensagemRegistrar, pedidoAvaliar, pedidoPixInformar, pedidoPorId, pedidoRegistrar,
} from "../loja.js";
import { exigirLogin, gravarEstadoPedido, lerEstadoPedido } from "../sessao.js";
import { cpfValido, emailValido, somenteDigitos, texto } from "../validacoes.js";
import { corpo, inteiro } from "./utilitarios.js";

export const rotasPublicas = Router();

rotasPublicas.get("/saude", (_req, res) => void res.json({ status: "ok" }));
rotasPublicas.get("/sessao", (req, res) => void res.json({ usuario: req.usuario ?? null }));
rotasPublicas.get("/catalogo", async (_req, res) => void res.json(await carregarCatalogo()));

// ---------- avaliações de produtos ----------

rotasPublicas.get("/produtos/:id/avaliacoes", async (req, res) => {
  res.json(await avaliacoesDoProduto(inteiro(req.params.id)));
});

rotasPublicas.post("/produtos/:id/avaliacoes", exigirLogin, async (req, res) => {
  const id = inteiro(req.params.id);
  const nota = inteiro(corpo(req).nota);
  const comentario = texto(corpo(req).comentario);
  if (!(await produtoPorId(id))) return void res.status(404).json({ erro: "Produto não encontrado." });
  if (nota < 1 || nota > 5) return void res.status(400).json({ erro: "Escolha de 1 a 5 estrelas." });
  if ([...comentario].length > 600) return void res.status(400).json({ erro: "O comentário pode ter até 600 caracteres." });
  if (!(await avaliacaoSalvar(id, req.usuario!.id, req.usuario!.nome, nota, comentario))) {
    return void res.status(500).json({ erro: "Não foi possível salvar agora. Tente de novo em instantes." });
  }
  res.status(201).json({ ok: true });
});

// ---------- contato ----------

rotasPublicas.post("/mensagens", async (req, res) => {
  const nome = texto(corpo(req).nome);
  const email = texto(corpo(req).email);
  const mensagem = texto(corpo(req).mensagem);
  const erros: Record<string, string> = {};
  if ([...nome].length < 2) erros.nome = "Digite seu nome.";
  if (!emailValido(email)) erros.email = "Digite um e-mail válido.";
  if ([...mensagem].length < 10) erros.mensagem = "Conte um pouco mais (mínimo 10 caracteres).";
  if (Object.keys(erros).length) return void res.status(400).json({ erros });

  if (!(await mensagemRegistrar(nome, email, mensagem))) {
    return void res.status(500).json({ erros: { mensagem: "Não foi possível salvar sua mensagem. Tente de novo em instantes." } });
  }
  // A mensagem já foi salva (aparece no painel admin). O e-mail é um extra:
  // se o SMTP não estiver configurado, o cliente continua vendo "enviada".
  await enviarEmail({
    para: EMAIL_SUPORTE,
    paraNome: "Y3D Suporte",
    assunto: "Nova mensagem pelo site da Y3D Creations",
    corpo: `Nova mensagem enviada pelo formulário do site Y3D Creations.\n\nNome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}\n`,
    responderPara: email,
    responderNome: nome,
  });
  res.status(201).json({ ok: true });
});

// ---------- pedidos ----------

const FORMAS_PAGAMENTO = ["pix", "cartao", "boleto"];

rotasPublicas.post("/pedidos", async (req, res) => {
  const dados = corpo(req) as Partial<DadosCheckout> & Record<string, unknown>;
  const cpf = texto(dados.cpf);
  const campos = {
    nome: texto(dados.nome), telefone: texto(dados.telefone), cep: texto(dados.cep),
    endereco: texto(dados.endereco), bairro: texto(dados.bairro), cidade: texto(dados.cidade), pagamento: texto(dados.pagamento),
  };

  // o preço de cada item vem sempre do catálogo do servidor, nunca do navegador
  const catalogo = await carregarCatalogo();
  const itens = (Array.isArray(dados.itens) ? dados.itens : []).flatMap((bruto) => {
    const item = bruto && typeof bruto === "object" ? (bruto as Record<string, unknown>) : {};
    const produto = catalogo.produtos.find((p) => p.id === inteiro(item.id));
    const quantidade = Math.min(99, Math.max(1, inteiro(item.quantidade)));
    return produto ? [{ id: produto.id, nome: produto.nome, quantidade, preco: produto.preco }] : [];
  });
  if (itens.length === 0) return void res.status(400).json({ erro: "Seu carrinho está vazio." });

  if (somenteDigitos(cpf) === "") return void res.status(400).json({ erro: "Informe o CPF para finalizar o pedido." });
  if (!cpfValido(cpf)) return void res.status(400).json({ erro: "CPF inválido. Confira os números e tente de novo." });
  if (Object.entries(campos).some(([chave, valor]) => chave !== "pagamento" && valor === "")) {
    return void res.status(400).json({ erro: "Preencha todos os dados do endereço de entrega." });
  }
  if (!FORMAS_PAGAMENTO.includes(campos.pagamento)) return void res.status(400).json({ erro: "Escolha a forma de pagamento." });

  const total = Math.round(itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0) * 100) / 100;
  const pedidoId = await pedidoRegistrar({
    usuario_id: req.usuario ? req.usuario.id : null,
    ...campos,
    email: req.usuario ? req.usuario.email : "",
    cpf: somenteDigitos(cpf),
    itens,
    total,
  });
  if (pedidoId <= 0) return void res.status(500).json({ erro: "Não foi possível registrar o pedido agora. Seu carrinho foi mantido, tente de novo." });

  // libera a avaliação do atendimento (e o Pix) só para quem acabou de fazer este pedido
  gravarEstadoPedido(req, res, { avaliar: pedidoId, ...(campos.pagamento === "pix" ? { pix: pedidoId } : {}) });
  const resposta: RespostaCheckout = { pedidoId, total, pagamento: campos.pagamento };
  res.status(201).json(resposta);
});

/** Pedido Pix que a pessoa já disse ter pago: a tela de checkout mostra o status dele ao recarregar. */
rotasPublicas.get("/pedidos/pix-atual", async (req, res) => {
  const id = lerEstadoPedido(req).pixInformado ?? 0;
  const pedido = id > 0 ? await pedidoPorId(id) : null;
  if (!pedido || pedido.pagamento !== "pix" || !pedido.pix_informado_em) return void res.json({ pedido: null });
  res.json({ pedido: { id: pedido.id, status: pedido.status } });
});

rotasPublicas.post("/pedidos/:id/pix-informado", async (req, res) => {
  const id = inteiro(req.params.id);
  const estado = lerEstadoPedido(req);
  if (id <= 0 || id !== (estado.pix ?? 0) || !(await pedidoPixInformar(id))) {
    return void res.status(400).json({ erro: "Não foi possível informar o pagamento deste pedido Pix. Confira seu pedido e tente novamente." });
  }
  gravarEstadoPedido(req, res, { ...estado, pixInformado: id });
  res.json({ ok: true });
});

rotasPublicas.post("/pedidos/:id/avaliar-atendimento", async (req, res) => {
  const id = inteiro(req.params.id);
  const nota = inteiro(corpo(req).nota);
  const comentario = texto(corpo(req).comentario);
  const estado = lerEstadoPedido(req);
  // só dá para avaliar o pedido que acabou de ser feito neste navegador
  if (id <= 0 || id !== (estado.avaliar ?? 0)) return void res.status(400).json({ ok: false, mensagem: "Não encontramos o pedido para avaliar." });
  if (nota < 1 || nota > 5) return void res.status(400).json({ ok: false, mensagem: "Toque em uma estrela para avaliar." });
  if ([...comentario].length > 600) return void res.status(400).json({ ok: false, mensagem: "O comentário pode ter até 600 caracteres." });
  if (!(await pedidoAvaliar(id, nota, comentario))) {
    return void res.status(500).json({ ok: false, mensagem: "Não foi possível salvar agora. Tente de novo em instantes." });
  }
  const { avaliar: _avaliar, ...resto } = estado;
  gravarEstadoPedido(req, res, resto);
  res.json({ ok: true, mensagem: "Obrigado pela sua avaliação!" });
});
