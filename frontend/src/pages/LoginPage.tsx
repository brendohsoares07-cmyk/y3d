import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { useAuth } from "../context/AuthContext";
import { useFormState } from "../hooks/useFormState";
import { ApiError } from "../services/http";
import { collectErrors, isEmail, requiredMsg } from "../utils/validators";

type Values = { email: string; senha: string };

export function LoginPage() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const aviso = (location.state as { mensagem?: string } | null)?.mensagem;

  const { values, errors, setErrors, setField } = useFormState<Values>({ email: "", senha: "" });
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (usuario) return <Navigate to="/loja" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const encontrados = collectErrors<Values>([
      ["email", !values.email.trim() ? "E-mail é obrigatório" : isEmail(values.email) ? null : "E-mail inválido"],
      ["senha", requiredMsg(values.senha, "Senha")],
    ]);
    setErrors(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setSaving(true);
    setApiError(null);
    try {
      await login(values.email.trim(), values.senha);
      navigate("/loja"); // área logada
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout titulo="Entrar">
      <form onSubmit={submit} noValidate className="form">
        {aviso && <Alert tipo="sucesso">{aviso}</Alert>}
        {apiError && <Alert>{apiError}</Alert>}
        <FormField label="E-mail" name="email" type="email" autoComplete="email" value={values.email}
          onChange={(v) => setField("email", v)} error={errors.email} />
        <FormField label="Senha" name="senha" type="password" autoComplete="current-password" value={values.senha}
          onChange={(v) => setField("senha", v)} error={errors.senha} />
        <Button type="submit" disabled={saving}>{saving ? "Entrando..." : "Entrar"}</Button>
        <p className="muted center">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
