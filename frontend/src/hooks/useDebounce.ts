import { useEffect, useState } from "react";

/** Só atualiza o valor depois de a pessoa parar de digitar. */
export function useDebounce<T>(valor: T, atrasoMs = 300): T {
  const [debounced, setDebounced] = useState(valor);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(valor), atrasoMs);
    return () => window.clearTimeout(timer);
  }, [valor, atrasoMs]);
  return debounced;
}
