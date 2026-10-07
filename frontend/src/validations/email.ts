const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (valor: string): boolean => EMAIL_REGEX.test(valor.trim());
