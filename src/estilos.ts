import { useEffect, useState } from "react";

/**
 * Cada tela carrega apenas seu CSS para evitar conflitos entre loja, login e painel.
 * A remoção é adiada um instante: ao trocar de tela dentro da loja o arquivo não é descarregado à toa.
 */
interface Registro { el: HTMLLinkElement; usos: number; carregado: boolean; timer?: number; ouvintes: Set<() => void> }
const registros = new Map<string, Registro>();

function obter(href: string): Registro {
  const existente = registros.get(href);
  if (existente) {
    window.clearTimeout(existente.timer);
    existente.usos++;
    return existente;
  }
  const el = document.createElement("link");
  el.rel = "stylesheet";
  el.href = href;
  const registro: Registro = { el, usos: 1, carregado: false, ouvintes: new Set() };
  const concluir = (): void => {
    registro.carregado = true;
    registro.ouvintes.forEach((f) => f());
  };
  el.addEventListener("load", concluir);
  el.addEventListener("error", concluir); // sem o CSS a página ainda aparece, só sem estilo
  document.head.appendChild(el);
  registros.set(href, registro);
  return registro;
}

function soltar(href: string): void {
  const registro = registros.get(href);
  if (!registro) return;
  registro.usos--;
  if (registro.usos > 0) return;
  registro.timer = window.setTimeout(() => {
    registro.el.remove();
    registros.delete(href);
  }, 300);
}

/** Liga o CSS e devolve true quando ele terminou de carregar (evita um clarão de página sem estilo). */
export function useFolhaDeEstilo(href: string): boolean {
  const [pronto, setPronto] = useState(() => registros.get(href)?.carregado ?? false);
  useEffect(() => {
    const registro = obter(href);
    const atualizar = (): void => setPronto(true);
    if (registro.carregado) setPronto(true);
    else registro.ouvintes.add(atualizar);
    return () => {
      registro.ouvintes.delete(atualizar);
      soltar(href);
    };
  }, [href]);
  return pronto;
}

/** Atualiza o título da aba no formato "Página · Y3D Creations". */
export function useTitulo(titulo?: string): void {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Y3D Creations` : "Y3D Creations";
  }, [titulo]);
}
