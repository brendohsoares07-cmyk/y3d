export function linearRegression(valores: readonly number[]): number[] {
  if (valores.length === 0) return [];
  const mediaX = (valores.length - 1) / 2;
  const mediaY = valores.reduce((total, valor) => total + valor, 0) / valores.length;
  const variacaoX = valores.reduce((total, _valor, indice) => total + (indice - mediaX) ** 2, 0);
  const covariacao = valores.reduce(
    (total, valor, indice) => total + (indice - mediaX) * (valor - mediaY),
    0,
  );
  const inclinacao = variacaoX === 0 ? 0 : covariacao / variacaoX;
  const intercepto = mediaY - inclinacao * mediaX;

  return valores.map((_valor, indice) => Math.round((intercepto + inclinacao * indice) * 100) / 100);
}
