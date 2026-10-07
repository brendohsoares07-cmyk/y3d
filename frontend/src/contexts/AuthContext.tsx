import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setUnauthorizedHandler, tokenStorage } from "../services/http";
import { authApi } from "../services/resources";
import { Usuario } from "../types";

type AuthContextValue = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  atualizarUsuario: (usuario: Usuario) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Guarda o usuário logado para o app inteiro (nome no topo, tela de perfil, etc.). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(tokenStorage.get() !== null);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUsuario(null);
  }, []);

  // Token expirado em qualquer requisição → limpa a sessão
  useEffect(() => {
    setUnauthorizedHandler(() => setUsuario(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  // Ao abrir o app com token salvo, recupera o usuário
  useEffect(() => {
    if (!tokenStorage.get()) return;
    authApi
      .me()
      .then(setUsuario)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const resposta = await authApi.login(email, senha);
    tokenStorage.set(resposta.token);
    setUsuario(resposta.usuario);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ usuario, loading, login, logout, atualizarUsuario: setUsuario }),
    [usuario, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return contexto;
}
