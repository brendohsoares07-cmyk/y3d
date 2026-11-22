import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

interface Avisos {
  /** Aviso de sessão no topo da loja ("Você saiu da sua conta" etc.). */
  flash: string | null;
  avisar: (mensagem: string) => void;
  fecharFlash: () => void;
  toastTexto: string;
  toastAtivo: boolean;
  toast: (mensagem: string) => void;
}

const Contexto = createContext<Avisos | null>(null);

export function AvisosProvider({ children }: { children: ReactNode }) {
  const [flash, setFlash] = useState<string | null>(null);
  const [toastTexto, setToastTexto] = useState("");
  const [toastAtivo, setToastAtivo] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  const toast = useCallback((mensagem: string) => {
    setToastTexto(mensagem);
    setToastAtivo(true);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setToastAtivo(false), 2600);
  }, []);

  const valor = useMemo<Avisos>(
    () => ({ flash, avisar: setFlash, fecharFlash: () => setFlash(null), toastTexto, toastAtivo, toast }),
    [flash, toastTexto, toastAtivo, toast],
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useAvisos(): Avisos {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useAvisos fora do AvisosProvider");
  return valor;
}

/** Caixinha de aviso rápido (#toast), no canto da tela. */
export function Toast() {
  const { toastTexto, toastAtivo } = useAvisos();
  return (
    <div id="toast" role="status" aria-live="polite" className={toastAtivo ? "on" : ""}>
      {toastTexto}
    </div>
  );
}

/** Aviso no topo da página: some sozinho em 6 segundos e tem botão para fechar. */
export function AvisoFlash() {
  const { flash, fecharFlash } = useAvisos();
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    setSaindo(false);
    if (!flash) return;
    const fechar = window.setTimeout(() => setSaindo(true), 6000);
    return () => window.clearTimeout(fechar);
  }, [flash]);

  useEffect(() => {
    if (!saindo) return;
    const remover = window.setTimeout(fecharFlash, 400);
    return () => window.clearTimeout(remover);
  }, [saindo, fecharFlash]);

  if (!flash) return null;
  return (
    <div className={`alert${saindo ? " sai" : ""}`} role="status" data-flash>
      <span>{flash}</span>
      <button type="button" className="alert-x" aria-label="Fechar aviso" onClick={() => setSaindo(true)}>×</button>
    </div>
  );
}
