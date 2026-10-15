export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const requiredMsg = (valor: string, rotulo: string): string | null =>
  valor.trim() === "" ? `${rotulo} é obrigatório` : null;

/** Monta o objeto de erros só com os campos que têm mensagem. */
export function collectErrors<T>(checks: Array<[keyof T, string | null]>): FieldErrors<T> {
  const erros: FieldErrors<T> = {};
  for (const [campo, mensagem] of checks) {
    if (mensagem) erros[campo] = mensagem;
  }
  return erros;
}
