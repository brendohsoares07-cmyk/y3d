import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

export type Column<T> = { header: string; render: (item: T) => ReactNode };

type Props<T extends { id: number }> = {
  columns: Column<T>[];
  items: T[];
  loading: boolean;
  editPath: (item: T) => string;
  onDelete: (item: T) => void;
};

/** Tabela genérica com ações de editar e excluir. */
export function DataTable<T extends { id: number }>({ columns, items, loading, editPath, onDelete }: Props<T>) {
  if (loading) return <p className="muted">Carregando...</p>;
  if (items.length === 0) return <p className="muted">Nenhum registro encontrado.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.header}>{c.header}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columns.map((c) => (
                <td key={c.header}>{c.render(item)}</td>
              ))}
              <td className="actions">
                <Link className="btn btn-outline" to={editPath(item)}>
                  Editar
                </Link>
                <Button variant="danger" onClick={() => onDelete(item)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
