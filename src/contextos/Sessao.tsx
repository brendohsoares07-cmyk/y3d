import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UsuarioPublico } from "../../shared/tipos";
import { api } from "../api";

interface Sessao {
  usuario: UsuarioPublico | null;
  carregando: boolean;
  definirUsuario: (usuario: UsuarioPublico | null) => void;
  sair: () => Promise<void>;
}

const Contexto = createContext<Sessao | null>(null);

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioPublico | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api<{ usuario: UsuarioPublico | null }>("/sessao")
      .then((r) => setUsuario(r.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  const sair = useCallback(async () => {
    await api("/auth/logout", { metodo: "POST" }).catch(() => undefined);
    setUsuario(null);
  }, []);

  const valor = useMemo<Sessao>(() => ({ usuario, carregando, definirUsuario: setUsuario, sair }), [usuario, carregando, sair]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSessao(): Sessao {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useSessao fora do SessaoProvider");
  return valor;
}
