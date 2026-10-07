export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (valor: string): boolean => EMAIL_REGEX.test(valor.trim());

export const onlyDigits = (valor: string): string => valor.replace(/\D/g, "");

export function isCpf(valor: string): boolean {
  const cpf = onlyDigits(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digito = (tamanho: number): number => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

/** Aplica a máscara 000.000.000-00 enquanto a pessoa digita. */
export function maskCpf(valor: string): string {
  const d = onlyDigits(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

/** O que ainda falta para a senha ser forte (mesmas regras do backend). */
export function passwordIssues(senha: string): string[] {
  const problemas: string[] = [];
  if (senha.length < 8) problemas.push("mínimo de 8 caracteres");
  if (!/[a-z]/.test(senha)) problemas.push("uma letra minúscula");
  if (!/[A-Z]/.test(senha)) problemas.push("uma letra maiúscula");
  if (!/\d/.test(senha)) problemas.push("um número");
  if (!/[^A-Za-z0-9]/.test(senha)) problemas.push("um caractere especial");
  return problemas;
}

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
