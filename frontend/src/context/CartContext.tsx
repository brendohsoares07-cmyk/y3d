import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { useStoredState } from "../hooks/useStoredState";
import { Produto } from "../types";

export type CartItem = {
  produtoId: number;
  nome: string;
  preco: number;
  imagem: string | null;
  emoji: string | null;
  quantidade: number;
  personalizacao: string | null;
};

type CartContextValue = {
  itens: CartItem[];
  totalItens: number;
  subtotal: number;
  adicionar: (produto: Produto, quantidade: number, personalizacao: string | null) => void;
  alterarQuantidade: (item: CartItem, quantidade: number) => void;
  remover: (item: CartItem) => void;
  limpar: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const mesmoItem = (a: CartItem, b: CartItem) => a.produtoId === b.produtoId && a.personalizacao === b.personalizacao;
const MAX_POR_ITEM = 99;

/** Carrinho de compras guardado no navegador, separado por usuário. */
export function CartProvider({ usuarioId, children }: { usuarioId: number; children: ReactNode }) {
  const [itens, setItens] = useStoredState<CartItem[]>(`y3d_carrinho_${usuarioId}`, []);

  const adicionar = useCallback(
    (produto: Produto, quantidade: number, personalizacao: string | null) => {
      const novo: CartItem = {
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagens[0] ?? null,
        emoji: produto.emoji,
        quantidade,
        personalizacao,
      };
      setItens((atual) => {
        const existente = atual.find((i) => mesmoItem(i, novo));
        if (!existente) return [...atual, novo];
        return atual.map((i) =>
          mesmoItem(i, novo) ? { ...i, quantidade: Math.min(MAX_POR_ITEM, i.quantidade + quantidade) } : i,
        );
      });
    },
    [setItens],
  );

  const alterarQuantidade = useCallback(
    (item: CartItem, quantidade: number) =>
      setItens((atual) =>
        atual.map((i) => (mesmoItem(i, item) ? { ...i, quantidade: Math.min(MAX_POR_ITEM, Math.max(1, quantidade)) } : i)),
      ),
    [setItens],
  );

  const remover = useCallback((item: CartItem) => setItens((atual) => atual.filter((i) => !mesmoItem(i, item))), [setItens]);
  const limpar = useCallback(() => setItens([]), [setItens]);

  const value = useMemo<CartContextValue>(
    () => ({
      itens,
      totalItens: itens.reduce((soma, i) => soma + i.quantidade, 0),
      subtotal: itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0),
      adicionar,
      alterarQuantidade,
      remover,
      limpar,
    }),
    [itens, adicionar, alterarQuantidade, remover, limpar],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return contexto;
}
