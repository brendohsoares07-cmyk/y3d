import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Só deixa passar quem está logado; os demais vão para /login. */
export function ProtectedRoute() {
  const { usuario, loading } = useAuth();
  if (loading) return <p className="muted center-msg">Carregando...</p>;
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}
