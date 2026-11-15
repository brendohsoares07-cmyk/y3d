import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Produto } from "../../shared/tipos";
import { useCatalogo } from "./Catalogo";

/** O carrinho do PHP ficava na sessão; aqui fica no navegador (localStorage), no mesmo formato id → quantidade. */
const CHAVE = "y3d_carrinho";
type Mapa = Record<number, number>;

export interface ItemCarrinho { produto: Produto; quantidade: number; subtotal: number }

interface ContextoCarrinho {
  itens: ItemCarrinho[];
  totalItens: number;
  subtotal: number;
  adicionar: (id: number, quantidade?: number) => void;
  atualizar: (id: number, quantidade: number) => void;
  remover: (id: number) => void;
  limpar: () => void;
}

const Contexto = createContext<ContextoCarrinho | null>(null);

function ler(): Mapa {
  try {
    const bruto: unknown = JSON.parse(localStorage.getItem(CHAVE) ?? "{}");
    if (!bruto || typeof bruto !== "object") return {};
    const mapa: Mapa = {};
    for (const [id, qtd] of Object.entries(bruto as Record<string, unknown>)) {
      const n = Math.trunc(Number(qtd));
      if (Number(id) > 0 && n > 0) mapa[Number(id)] = n;
    }
    return mapa;
  } catch {
    return {};
  }
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const { produtoPorId, carregado } = useCatalogo();
  const [mapa, setMapa] = useState<Mapa>(ler);

  const gravar = useCallback((proximo: Mapa) => {
    setMapa(proximo);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(proximo));
    } catch {
      /* localStorage indisponível: o carrinho vale só nesta aba */
    }
  }, []);

  // mantém várias abas em sincronia
  useEffect(() => {
    const aoMudar = (e: StorageEvent): void => {
      if (e.key === CHAVE) setMapa(ler());
    };
    window.addEventListener("storage", aoMudar);
    return () => window.removeEventListener("storage", aoMudar);
  }, []);

  const adicionar = useCallback((id: number, quantidade = 1) => {
    if (carregado && !produtoPorId(id)) return;
    const atual = ler();
    atual[id] = (atual[id] ?? 0) + Math.max(1, quantidade);
    gravar(atual);
  }, [carregado, produtoPorId, gravar]);

  const atualizar = useCallback((id: number, quantidade: number) => {
    const atual = ler();
    if (quantidade <= 0) delete atual[id];
    else atual[id] = quantidade;
    gravar(atual);
  }, [gravar]);

  const remover = useCallback((id: number) => {
    const atual = ler();
    delete atual[id];
    gravar(atual);
  }, [gravar]);

  const limpar = useCallback(() => gravar({}), [gravar]);

  const valor = useMemo<ContextoCarrinho>(() => {
    const itens: ItemCarrinho[] = [];
    for (const [id, quantidade] of Object.entries(mapa)) {
      const produto = produtoPorId(Number(id));
      if (produto) itens.push({ produto, quantidade, subtotal: produto.preco * quantidade });
    }
    const totalItens = carregado ? itens.reduce((s, i) => s + i.quantidade, 0) : Object.values(mapa).reduce((s, q) => s + q, 0);
    return { itens, totalItens, subtotal: itens.reduce((s, i) => s + i.subtotal, 0), adicionar, atualizar, remover, limpar };
  }, [mapa, produtoPorId, carregado, adicionar, atualizar, remover, limpar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrinho(): ContextoCarrinho {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useCarrinho fora do CarrinhoProvider");
  return valor;
}
