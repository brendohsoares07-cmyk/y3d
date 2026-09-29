export const formatMoney = (valor: number): string =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** R$ 1.890 (sem centavos), para rótulos de gráfico. */
export const formatMoneyShort = (valor: number): string =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function iniciais(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}
