/** Mesmas regras de includes/validacoes.php. A regra de CPF também existe em src/cpf.ts: se mudar aqui, mude lá. */

export const somenteDigitos = (valor: string): string => valor.replace(/\D+/g, "");

export function cpfValido(valor: string): boolean {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    let digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;
    if (digito !== Number(cpf[tamanho])) return false;
  }
  return true;
}

export function emailValido(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Lê um campo de texto vindo do corpo da requisição (qualquer coisa que não seja texto vira vazio). */
export function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}
