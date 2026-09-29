import { useEffect, useState } from "react";
import { ListableApi } from "../services/CrudApi";

/** Carrega registros de outro recurso (ex.: categorias) para usar em selects e nomes. */
export function useOptions<T>(api: ListableApi<T>): T[] {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    api
      .list(1, 100)
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, [api]);
  return items;
}
