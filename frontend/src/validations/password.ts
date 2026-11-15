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
