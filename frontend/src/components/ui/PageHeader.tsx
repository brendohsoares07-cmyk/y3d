import { ReactNode } from "react";

type Props = { titulo: string; subtitulo?: string; acao?: ReactNode };

export function PageHeader({ titulo, subtitulo, acao }: Props) {
  return (
    <header className="page-header">
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p className="muted">{subtitulo}</p>}
      </div>
      {acao}
    </header>
  );
}
