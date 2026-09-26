import { ValidationError } from "../errors/AppError";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Valida CPF pelos dígitos verificadores. */
export function isCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digito = (tamanho: number): number => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

/** Lista o que falta para a senha ser considerada forte. */
export function passwordIssues(senha: string): string[] {
  const problemas: string[] = [];
  if (senha.length < 8) problemas.push("ter no mínimo 8 caracteres");
  if (senha.length > 72) problemas.push("ter no máximo 72 caracteres");
  if (!/[a-z]/.test(senha)) problemas.push("ter uma letra minúscula");
  if (!/[A-Z]/.test(senha)) problemas.push("ter uma letra maiúscula");
  if (!/\d/.test(senha)) problemas.push("ter um número");
  if (!/[^A-Za-z0-9]/.test(senha)) problemas.push("ter um caractere especial");
  return problemas;
}

/** Texto obrigatório, com tamanho mínimo e máximo. Retorna o texto aparado. */
export function requireText(value: unknown, campo: string, min = 1, max = 255): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`O campo ${campo} é obrigatório`);
  }
  const texto = value.trim();
  if (texto.length < min || texto.length > max) {
    throw new ValidationError(`O campo ${campo} deve ter entre ${min} e ${max} caracteres`);
  }
  return texto;
}

function toNumber(value: unknown): unknown {
  return typeof value === "string" && value.trim() !== "" ? Number(value) : value;
}

export function requireInt(value: unknown, campo: string, min: number, max = 2_000_000_000): number {
  const numero = toNumber(value);
  if (typeof numero !== "number" || !Number.isInteger(numero) || numero < min || numero > max) {
    throw new ValidationError(`O campo ${campo} deve ser um número inteiro entre ${min} e ${max}`);
  }
  return numero;
}

export function requirePositiveMoney(value: unknown, campo: string): number {
  const numero = toNumber(value);
  if (typeof numero !== "number" || !Number.isFinite(numero) || numero <= 0 || numero > 99_999_999) {
    throw new ValidationError(`O campo ${campo} deve ser um valor maior que zero`);
  }
  return Math.round(numero * 100) / 100;
}

export function requireOneOf<T extends string>(value: unknown, campo: string, opcoes: readonly T[]): T {
  const achado = opcoes.find((opcao) => opcao === value);
  if (achado === undefined) {
    throw new ValidationError(`O campo ${campo} deve ser um de: ${opcoes.join(", ")}`);
  }
  return achado;
}

/** Texto opcional: vazio ou tipo errado viram null. */
export function optionalText(value: unknown, max = 2000): string | null {
  if (typeof value !== "string") return null;
  const texto = value.trim();
  if (texto === "") return null;
  if (texto.length > max) throw new ValidationError(`O texto deve ter no máximo ${max} caracteres`);
  return texto;
}

/** Lista de textos (ex.: imagens, detalhes). Ignora itens vazios; erro se não for lista de textos. */
export function requireStringList(value: unknown, campo: string, maxItens = 20, maxTamanho = 300): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new ValidationError(`O campo ${campo} deve ser uma lista`);
  const itens = value.map((item) => (typeof item === "string" ? item.trim() : "")).filter((item) => item !== "");
  if (itens.length > maxItens || itens.some((item) => item.length > maxTamanho)) {
    throw new ValidationError(`O campo ${campo} aceita até ${maxItens} itens de ${maxTamanho} caracteres`);
  }
  return itens;
}

/** Lê uma lista de textos gravada como JSON no banco; se estiver corrompida, devolve lista vazia. */
export function parseJsonList(valor: unknown): string[] {
  if (typeof valor !== "string") return [];
  try {
    const lista: unknown = JSON.parse(valor);
    return Array.isArray(lista) ? lista.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
