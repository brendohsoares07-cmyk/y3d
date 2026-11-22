import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/** Favoritos ficam só no navegador (localStorage). */
const CHAVE = "y3d_favoritos";

interface ContextoFavoritos {
  ids: number[];
  ehFavorito: (id: number) => boolean;
  /** Devolve true quando acabou de favoritar. */
  alternar: (id: number) => boolean;
}

const Contexto = createContext<ContextoFavoritos | null>(null);

function ler(): number[] {
  try {
    const bruto: unknown = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
    return Array.isArray(bruto) ? bruto.map(Number).filter((n) => Number.isInteger(n) && n > 0) : [];
  } catch {
    return [];
  }
}

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>(ler);

  useEffect(() => {
    const aoMudar = (e: StorageEvent): void => {
      if (e.key === CHAVE) setIds(ler());
    };
    window.addEventListener("storage", aoMudar);
    return () => window.removeEventListener("storage", aoMudar);
  }, []);

  const alternar = useCallback((id: number): boolean => {
    const atual = ler();
    const indice = atual.indexOf(id);
    if (indice >= 0) atual.splice(indice, 1);
    else atual.push(id);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(atual));
    } catch {
      /* localStorage indisponível: segue sem persistir */
    }
    setIds([...atual]);
    return indice < 0;
  }, []);

  const valor = useMemo<ContextoFavoritos>(() => ({ ids, ehFavorito: (id) => ids.includes(id), alternar }), [ids, alternar]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useFavoritos(): ContextoFavoritos {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useFavoritos fora do FavoritosProvider");
  return valor;
}
