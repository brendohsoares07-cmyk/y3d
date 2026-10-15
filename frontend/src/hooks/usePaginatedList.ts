import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../services/http";
import { ListableApi } from "../services/CrudApi";
import { Page } from "../types";

/** Carrega uma listagem paginada e oferece exclusão com recarga. */
export function usePaginatedList<T extends { id: number }>(api: ListableApi<T>) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Page<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0); // muda para forçar recarga

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    api
      .list(page)
      .then((r) => {
        if (cancelado) return;
        // apagou o último item da última página → volta uma página
        if (r.data.length === 0 && page > 1) setPage(page - 1);
        else setResult(r);
        setError(null);
      })
      .catch((e: unknown) => !cancelado && setError(e instanceof ApiError ? e.message : "Erro ao carregar dados"))
      .finally(() => !cancelado && setLoading(false));
    return () => {
      cancelado = true;
    };
  }, [api, page, version]);

  const remove = useCallback(
    async (id: number) => {
      try {
        await api.remove(id);
        setVersion((v) => v + 1);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Erro ao excluir");
      }
    },
    [api],
  );

  return { items: result?.data ?? [], page, totalPages: result?.totalPages ?? 1, loading, error, setPage, remove };
}
