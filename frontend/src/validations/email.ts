const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(valor: string): boolean {
  const emailSemEspacos = valor.trim();
  return EMAIL_REGEX.test(emailSemEspacos);
}
