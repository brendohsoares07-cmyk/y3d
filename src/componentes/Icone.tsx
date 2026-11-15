import { ICONES, type NomeIcone } from "../icones";

/** Desenha um dos ícones SVG do site (conteúdo fixo, extraído dos templates originais). */
export function Icone({ nome, className }: { nome: NomeIcone; className?: string }) {
  const { attrs, inner } = ICONES[nome];
  return <svg {...attrs} className={className} dangerouslySetInnerHTML={{ __html: inner }} />;
}
