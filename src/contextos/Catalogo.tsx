import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Catalogo as DadosCatalogo, Categorias, Produto } from "../../shared/tipos";
import { api } from "../api";

interface ContextoCatalogo {
  produtos: Produto[];
  categorias: Categorias;
  erro: string | null;
  carregado: boolean;
  recarregar: () => Promise<void>;
  produtoPorId: (id: number) => Produto | undefined;
}

const Contexto = createContext<ContextoCatalogo | null>(null);

export function CatalogoProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<DadosCatalogo>({ categorias: {}, produtos: [] });
  const [carregado, setCarregado] = useState(false);

  const recarregar = useCallback(async () => {
    try {
      setDados(await api<DadosCatalogo>("/catalogo"));
    } catch {
      /* mantém o que já estava na tela */
    } finally {
      setCarregado(true);
    }
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  const valor = useMemo<ContextoCatalogo>(
    () => ({
      produtos: dados.produtos,
      categorias: dados.categorias,
      erro: dados.erro ?? null,
      carregado,
      recarregar,
      produtoPorId: (id) => dados.produtos.find((p) => p.id === id),
    }),
    [dados, carregado, recarregar],
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCatalogo(): ContextoCatalogo {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useCatalogo fora do CatalogoProvider");
  return valor;
}
