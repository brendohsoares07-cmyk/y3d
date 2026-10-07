import { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Alert } from "./Alert";
import { Button } from "./Button";

type Props = {
  onSubmit: (event: FormEvent) => void;
  saving: boolean;
  loading?: boolean;
  apiError?: string | null;
  cancelTo: string;
  children: ReactNode;
};

/** Cartão de formulário padrão: erro da API, campos (children) e botões Salvar/Cancelar. */
export function ResourceForm({ onSubmit, saving, loading, apiError, cancelTo, children }: Props) {
  if (loading) return <p className="muted">Carregando...</p>;
  return (
    <form className="card form" onSubmit={onSubmit} noValidate>
      {apiError && <Alert>{apiError}</Alert>}
      {children}
      <div className="form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
        <Link className="btn btn-outline" to={cancelTo}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
