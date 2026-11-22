import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { PASTA_DADOS } from "./config.js";

/** Fila por arquivo: impede que duas alterações simultâneas se sobrescrevam. */
const filas = new Map<string, Promise<void>>();

async function comTrava<T>(nome: string, fn: () => Promise<T>): Promise<T> {
  const anterior = filas.get(nome) ?? Promise.resolve();
  let liberar!: () => void;
  const atual = new Promise<void>((resolver) => { liberar = resolver; });
  filas.set(nome, anterior.then(() => atual));
  await anterior;
  try {
    return await fn();
  } finally {
    liberar();
  }
}

function caminho(nome: string): string {
  return path.join(PASTA_DADOS, `${nome}.json`);
}

async function lerBruto(nome: string): Promise<unknown> {
  try {
    return JSON.parse(await fs.readFile(caminho(nome), "utf8")) as unknown;
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw erro;
  }
}

/** Grava de forma atômica: escreve num temporário e renomeia, para nunca deixar o arquivo pela metade. */
async function gravar(nome: string, dados: unknown): Promise<void> {
  await fs.mkdir(PASTA_DADOS, { recursive: true });
  const destino = caminho(nome);
  const temporario = `${destino}.tmp${randomBytes(6).toString("hex")}`;
  await fs.writeFile(temporario, JSON.stringify(dados, null, 4), "utf8");
  await fs.rename(temporario, destino);
}

export async function lerLista<T>(nome: string): Promise<T[]> {
  const dados = await lerBruto(nome);
  return Array.isArray(dados) ? (dados as T[]) : [];
}

/** Lê, deixa `alterar` mexer na lista e grava, tudo dentro da trava. Devolve false se der erro ao gravar. */
export function alterarLista<T>(nome: string, alterar: (lista: T[]) => T[]): Promise<boolean> {
  return comTrava(nome, async () => {
    try {
      const lista = await lerLista<T>(nome);
      await gravar(nome, alterar(lista));
      return true;
    } catch (erro) {
      console.error(`Não foi possível gravar ${nome}.json:`, erro);
      return false;
    }
  });
}

export async function lerObjeto<T>(nome: string): Promise<T | null> {
  const dados = await lerBruto(nome);
  return dados !== null && typeof dados === "object" && !Array.isArray(dados) ? (dados as T) : null;
}

export function alterarObjeto<T extends object>(nome: string, vazio: T, alterar: (dados: T) => T): Promise<boolean> {
  return comTrava(nome, async () => {
    try {
      const atual = (await lerObjeto<T>(nome)) ?? vazio;
      await gravar(nome, alterar(atual));
      return true;
    } catch (erro) {
      console.error(`Não foi possível gravar ${nome}.json:`, erro);
      return false;
    }
  });
}

export function proximoId(lista: { id?: number }[]): number {
  return lista.reduce((maior, item) => Math.max(maior, Number(item.id ?? 0)), 0) + 1;
}

export const agora = (): number => Math.floor(Date.now() / 1000);
