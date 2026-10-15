import { Button } from "./Button";

type Props = { page: number; totalPages: number; onChange: (page: number) => void };

export function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <nav className="pagination" aria-label="Paginação">
      <Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Anterior
      </Button>
      <span>
        Página {page} de {totalPages}
      </span>
      <Button variant="outline" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Próxima →
      </Button>
    </nav>
  );
}
