type Props = { nota: number | null; total: number };

/** Estrelas + nota + quantidade de avaliações. Some quando o produto ainda não foi avaliado. */
export function StarRating({ nota, total }: Props) {
  if (nota === null || total <= 0) return null;
  const cheias = Math.round(nota);
  return (
    <div className="rating" aria-label={`Nota ${nota} de 5`}>
      <span className="stars" aria-hidden="true">
        {"★".repeat(cheias)}
        <span className="stars-off">{"★".repeat(5 - cheias)}</span>
      </span>
      <span className="muted-inline">
        {nota.toFixed(1)} ({total} {total === 1 ? "avaliação" : "avaliações"})
      </span>
    </div>
  );
}
