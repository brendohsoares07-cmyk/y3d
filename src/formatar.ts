/** Formatação de preços, datas, estrelas e iniciais. */

const moeda = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatarPreco = (valor: number): string => `R$ ${moeda.format(valor)}`;
export const formatarNumeroPreco = (valor: number): string => moeda.format(valor);

export function estrelasTexto(nota: number): string {
  const cheias = Math.round(nota);
  let texto = "";
  for (let i = 1; i <= 5; i++) texto += i <= cheias ? "★" : "☆";
  return texto;
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  let ini = [...(partes[0] ?? "")][0] ?? "";
  if (partes.length > 1) ini += [...partes[partes.length - 1]][0] ?? "";
  return ini.toLocaleUpperCase("pt-BR");
}

/** Foto de perfil: URL completa, foto enviada pelo cliente (servida pela API) ou a logo. */
export function fotoUrl(foto: string | null | undefined): string {
  if (foto && foto.trim() !== "") {
    if (/^https?:\/\//i.test(foto)) return foto;
    if (foto.startsWith("avatares/")) return `/api/media/${foto}`;
    return `/assets/img/${foto.replace(/^\/+/, "")}`;
  }
  return "/assets/img/logo-y3d-transparente.png";
}

const FUSO = "America/Sao_Paulo";
const partesData = (segundos: number) =>
  Object.fromEntries(
    new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date(segundos * 1000))
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;

/** 12/11/2026 */
export function dataCurta(segundos: number): string {
  const p = partesData(segundos);
  return `${p.day}/${p.month}/${p.year}`;
}

/** 12/11/2026 14:30 (ou — quando não há data) */
export function dataHora(segundos: number): string {
  if (!(segundos > 0)) return "—";
  const p = partesData(segundos);
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

/** 14:30 */
export function hora(segundos: number): string {
  const p = partesData(segundos);
  return `${p.hour}:${p.minute}`;
}

export const WHATSAPP_URL =
  "https://wa.me/554499638985?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Y3D%20Creations%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";
export const INSTAGRAM_URL = "https://www.instagram.com/y3d.creations";
export const YOUTUBE_URL = "https://www.youtube.com/";
