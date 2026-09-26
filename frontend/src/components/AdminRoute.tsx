import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Dentro do ProtectedRoute: só administradores passam; os demais voltam ao início. */
export function AdminRoute() {
  const { usuario } = useAuth();
  return usuario?.admin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
