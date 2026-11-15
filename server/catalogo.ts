import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import padrao from "./produtos-padrao.json" with { type: "json" };
import type { Catalogo, Categorias, Produto } from "../shared/tipos.js";
import { alterarObjeto, lerLista, lerObjeto } from "./armazenamento.js";
import { PASTA_PUBLICA } from "./config.js";
import type { AvaliacaoProduto } from "../shared/tipos.js";

type ProdutoBase = Omit<Produto, "galeria" | "imagemPrincipal" | "miniaturas">;
interface Personalizacao { products: ProdutoBase[]; deleted: number[] }

export const CATEGORIAS = padrao.categorias as Categorias;
const PRODUTOS_PADRAO = padrao.produtos as unknown as ProdutoBase[];

// ---------- imagens (equivale a y3d_imagens_do_produto / y3d_miniatura) ----------

function urlHttps(valor: string): boolean {
  try {
    return new URL(valor).protocol === "https:";
  } catch {
    return false;
  }
}

function arquivoImagemExiste(imagem: string): boolean {
  const limpa = imagem.trim();
  if (limpa === "") return false;
  if (urlHttps(limpa)) return true;
  if (limpa.includes("..")) return false;
  return existsSync(path.join(PASTA_PUBLICA, limpa.replace(/^\/+/, "")));
}

function miniatura(imagem: string): string {
  if (urlHttps(imagem)) return imagem;
  const candidata = `${path.posix.dirname(imagem)}/thumbs/${path.posix.basename(imagem)}`;
  return arquivoImagemExiste(candidata) ? candidata : imagem;
}

// fotos reais usadas quando um produto está sem imagem própria (y3d_imagens_fallback_arquivos)
function imagensFallback(): string[] {
  try {
    return readdirSync(path.join(PASTA_PUBLICA, "assets/img/produtos/galeria"))
      .filter((f) => /^foto-.+\..+$/.test(f))
      .sort()
      .map((f) => `assets/img/produtos/galeria/${f}`);
  } catch {
    return [];
  }
}

function completar(produto: ProdutoBase): Produto {
  let imagens = (produto.imagens ?? []).map((i) => i.trim()).filter(Boolean);
  if (imagens.length === 0 && produto.imagem) imagens = [produto.imagem.trim()];
  let galeria = [...new Set(imagens.filter(arquivoImagemExiste))];
  if (galeria.length === 0) galeria = imagensFallback();
  return {
    ...produto,
    galeria,
    imagemPrincipal: galeria[0] ?? produto.imagem ?? "",
    miniaturas: galeria.map(miniatura),
  };
}

// ---------- leitura (padrão + personalizações do admin + notas dos clientes) ----------

async function lerPersonalizacao(): Promise<Personalizacao | null> {
  const dados = await lerObjeto<Personalizacao>("catalogo_produtos");
  if (dados === null) return { products: [], deleted: [] };
  if (!Array.isArray(dados.products) || !Array.isArray(dados.deleted)) return null;
  return dados;
}

export async function carregarCatalogo(): Promise<Catalogo> {
  const personalizacao = await lerPersonalizacao();
  let erro: string | undefined;
  let base = PRODUTOS_PADRAO;
  if (personalizacao === null) {
    erro = "Não foi possível carregar o catálogo personalizado. Confira os logs do servidor.";
  } else {
    const excluidos = new Set(personalizacao.deleted.map(Number));
    const editados = new Map<number, ProdutoBase>();
    for (const p of personalizacao.products) if (p && p.id !== undefined) editados.set(Number(p.id), p);
    const lista: ProdutoBase[] = [];
    for (const p of PRODUTOS_PADRAO) {
      if (excluidos.has(p.id)) continue;
      lista.push(editados.has(p.id) ? { ...p, ...editados.get(p.id)! } : p);
      editados.delete(p.id);
    }
    for (const p of editados.values()) if (!excluidos.has(Number(p.id))) lista.push(p);
    base = lista;
  }

  // notas reais dos clientes nos cartões e na página do produto
  const soma = new Map<number, number>();
  const qtd = new Map<number, number>();
  for (const a of await lerLista<AvaliacaoProduto>("avaliacoes")) {
    const id = Number(a.produto_id);
    soma.set(id, (soma.get(id) ?? 0) + Number(a.nota));
    qtd.set(id, (qtd.get(id) ?? 0) + 1);
  }
  const produtos = base.map((p) => {
    const q = qtd.get(p.id) ?? 0;
    return completar(q > 0 ? { ...p, avaliacao: Math.round(((soma.get(p.id) ?? 0) / q) * 10) / 10, num_avaliacoes: q } : p);
  });
  return { categorias: CATEGORIAS, produtos, ...(erro ? { erro } : {}) };
}

export async function produtoPorId(id: number): Promise<Produto | null> {
  return (await carregarCatalogo()).produtos.find((p) => p.id === id) ?? null;
}

// ---------- escrita pelo painel admin (equivale a y3d_catalogo_produto_*) ----------

type Resultado = { sucesso: string } | { erro: string };

function validarProduto(entrada: Record<string, unknown>, id: number): { produto: ProdutoBase } | { erro: string } {
  const campo = (nome: string): string => {
    const v = entrada[nome];
    return typeof v === "string" || typeof v === "number" ? String(v) : "";
  };
  const nome = campo("nome").trim();
  const categoria = campo("categoria");
  const preco = Number(campo("preco").trim().replace(",", "."));
  const precoTexto = campo("preco").trim();
  const descricao = campo("descricao").trim();
  const imagem = campo("imagem").trim();
  const tamanho = campo("tamanho").trim();
  const emoji = campo("emoji").trim() || "📦";
  const cor1 = campo("cor1") || "#3ddbf2";
  const cor2 = campo("cor2") || "#7c5cff";

  if ([...nome].length < 2 || [...nome].length > 100) return { erro: "O nome precisa ter entre 2 e 100 caracteres." };
  if (!(categoria in CATEGORIAS)) return { erro: "Selecione uma categoria válida." };
  if (precoTexto === "" || !Number.isFinite(preco) || preco <= 0 || preco > 1_000_000) {
    return { erro: "Informe um preço maior que zero e menor que R$ 1.000.000,00." };
  }
  if ([...descricao].length > 2000 || [...tamanho].length > 160) return { erro: "A descrição deve ter até 2.000 caracteres e o tamanho até 160." };
  if ([...imagem].length > 500) return { erro: "O caminho da imagem deve ter até 500 caracteres." };
  if ([...emoji].length > 8) return { erro: "O ícone deve ter até 8 caracteres." };
  for (const cor of [cor1, cor2]) {
    if (!/^#[0-9a-fA-F]{6}$/.test(cor)) return { erro: "Informe as cores no formato hexadecimal, por exemplo #3ddbf2." };
  }
  if (imagem !== "") {
    const caminhoLocalValido = /^assets\/img\/produtos\/[a-zA-Z0-9._/-]+$/.test(imagem);
    if ((!caminhoLocalValido && !urlHttps(imagem)) || imagem.includes("..")) {
      return { erro: "Use uma imagem em assets/img/produtos/ ou uma URL HTTPS válida." };
    }
  }
  return {
    produto: {
      id,
      nome,
      categoria,
      preco: Math.round(preco * 100) / 100,
      avaliacao: 0,
      num_avaliacoes: 0,
      vendidos: 0,
      cor1: cor1.toLowerCase(),
      cor2: cor2.toLowerCase(),
      emoji,
      imagem,
      imagens: imagem === "" ? [] : [imagem],
      formatos: ["Peça física"],
      tamanho: tamanho !== "" ? tamanho : "Impressa em 3D pela Y3D Creations",
      descricao,
    },
  };
}

export async function salvarProduto(entrada: Record<string, unknown>, idEditado: number): Promise<Resultado> {
  const personalizacao = await lerPersonalizacao();
  if (personalizacao === null) return { erro: "O catálogo não pôde ser lido. Nenhuma alteração foi salva." };
  const catalogo = await carregarCatalogo();
  if (idEditado > 0 && !catalogo.produtos.some((p) => p.id === idEditado)) return { erro: "O produto que você tentou editar não existe." };

  let id = idEditado;
  if (id <= 0) {
    const maior = Math.max(0, ...catalogo.produtos.map((p) => p.id), ...personalizacao.products.map((p) => Number(p.id ?? 0)));
    id = maior + 1;
  }
  const validacao = validarProduto(entrada, id);
  if ("erro" in validacao) return validacao;

  const ok = await alterarObjeto<Personalizacao>("catalogo_produtos", { products: [], deleted: [] }, (dados) => {
    const products = dados.products.filter((p) => Number(p.id) !== id);
    products.push(validacao.produto);
    return { products, deleted: dados.deleted.map(Number).filter((x) => x !== id) };
  });
  return ok ? { sucesso: "Produto salvo com sucesso." } : { erro: "Não foi possível salvar o produto. Confira as permissões da pasta de dados." };
}

export async function excluirProduto(id: number): Promise<Resultado> {
  const catalogo = await carregarCatalogo();
  if (id <= 0 || !catalogo.produtos.some((p) => p.id === id)) return { erro: "O produto que você tentou excluir não existe." };
  if ((await lerPersonalizacao()) === null) return { erro: "O catálogo não pôde ser lido. Nenhuma alteração foi salva." };
  const ok = await alterarObjeto<Personalizacao>("catalogo_produtos", { products: [], deleted: [] }, (dados) => ({
    products: dados.products.filter((p) => Number(p.id) !== id),
    deleted: [...new Set([...dados.deleted.map(Number), id])],
  }));
  return ok
    ? { sucesso: "Produto excluído do catálogo. Os pedidos antigos foram preservados." }
    : { erro: "Não foi possível excluir o produto. Confira as permissões da pasta de dados." };
}
