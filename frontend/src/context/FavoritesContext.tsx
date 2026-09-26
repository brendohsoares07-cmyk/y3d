import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { useStoredState } from "../hooks/useStoredState";

type FavoritesContextValue = {
  ids: number[];
  ehFavorito: (produtoId: number) => boolean;
  alternar: (produtoId: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/** Lista de favoritos guardada no navegador, separada por usuário. */
export function FavoritesProvider({ usuarioId, children }: { usuarioId: number; children: ReactNode }) {
  const [ids, setIds] = useStoredState<number[]>(`y3d_favoritos_${usuarioId}`, []);

  const alternar = useCallback(
    (produtoId: number) =>
      setIds((atual) => (atual.includes(produtoId) ? atual.filter((id) => id !== produtoId) : [...atual, produtoId])),
    [setIds],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ ids, ehFavorito: (id) => ids.includes(id), alternar }),
    [ids, alternar],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const contexto = useContext(FavoritesContext);
  if (!contexto) throw new Error("useFavorites deve ser usado dentro de <FavoritesProvider>");
  return contexto;
}
