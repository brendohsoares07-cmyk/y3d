/** Validação de CPF compartilhada com server/validacoes.ts; mantenha as regras alinhadas. */

export const somenteDigitos = (valor: string): string => valor.replace(/\D/g, "");

export function cpfValido(valor: string): boolean {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digito = (tamanho: number): number => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

export function mascararCpf(valor: string): string {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

/** Formata 11 dígitos como 000.000.000-00 (devolve o texto original se não tiver 11 dígitos). */
export function formatarCpf(cpf: string): string {
  const d = somenteDigitos(cpf);
  return d.length === 11 ? `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}` : cpf;
}

export const mascaraCpfOculto = (cpf: string): string => `•••.•••.•••-${cpf.slice(-2)}`;
