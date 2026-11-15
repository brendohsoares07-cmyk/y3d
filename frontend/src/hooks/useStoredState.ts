import { useEffect, useState } from "react";

function ler<T>(chave: string, inicial: T): T {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto === null ? inicial : (JSON.parse(bruto) as T);
  } catch {
    return inicial;
  }
}

/** useState que persiste no localStorage sob a chave informada. */
export function useStoredState<T>(chave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => ler(chave, inicial));

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      /* armazenamento cheio ou bloqueado: segue sem persistir */
    }
  }, [chave, valor]);

  return [valor, setValor] as const;
}
