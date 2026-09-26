import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { useFormState } from "../hooks/useFormState";
import { ApiError } from "../services/http";
import { authApi } from "../services/resources";
import { collectErrors, isCpf, isEmail, maskCpf, passwordIssues, requiredMsg } from "../utils/validators";

type Values = { nome: string; email: string; cpf: string; senha: string; confirmarSenha: string };

/** Mostra em tempo real o que ainda falta na senha (exclusivo desta página). */
function SenhaChecklist({ senha }: { senha: string }) {
  const faltando = passwordIssues(senha);
  if (senha === "" || faltando.length === 0) return null;
  return <small className="hint">A senha precisa de: {faltando.join(", ")}.</small>;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const linkLogin = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login";
  const { values, errors, setErrors, setField } = useFormState<Values>({
    nome: "", email: "", cpf: "", senha: "", confirmarSenha: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validar = (v: Values) =>
    collectErrors<Values>([
      ["nome", requiredMsg(v.nome, "Nome") ?? (v.nome.trim().length < 3 ? "Informe o nome completo" : null)],
      ["email", requiredMsg(v.email, "E-mail") ?? (isEmail(v.email) ? null : "E-mail inválido")],
      ["cpf", requiredMsg(v.cpf, "CPF") ?? (isCpf(v.cpf) ? null : "CPF inválido")],
      ["senha", requiredMsg(v.senha, "Senha") ?? (passwordIssues(v.senha).length ? "Senha fraca" : null)],
      ["confirmarSenha", v.confirmarSenha !== v.senha ? "As senhas não conferem" : null],
    ]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const encontrados = validar(values);
    setErrors(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setSaving(true);
    setApiError(null);
    try {
      await authApi.register({ nome: values.nome, email: values.email, cpf: values.cpf, senha: values.senha });
      navigate(linkLogin, { state: { mensagem: "Cadastro realizado! Faça login para continuar." } });
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : "Não foi possível cadastrar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout titulo="Criar conta">
      <form onSubmit={submit} noValidate className="form">
        {apiError && <Alert>{apiError}</Alert>}
        <FormField label="Nome completo" name="nome" value={values.nome} onChange={(v) => setField("nome", v)} error={errors.nome} />
        <FormField label="E-mail" name="email" type="email" value={values.email} onChange={(v) => setField("email", v)} error={errors.email} />
        <FormField label="CPF" name="cpf" placeholder="000.000.000-00" value={values.cpf}
          onChange={(v) => setField("cpf", maskCpf(v))} error={errors.cpf} />
        <FormField label="Senha" name="senha" type="password" autoComplete="new-password" value={values.senha}
          onChange={(v) => setField("senha", v)} error={errors.senha} />
        <SenhaChecklist senha={values.senha} />
        <FormField label="Confirmar senha" name="confirmarSenha" type="password" autoComplete="new-password"
          value={values.confirmarSenha} onChange={(v) => setField("confirmarSenha", v)} error={errors.confirmarSenha} />
        <Button type="submit" disabled={saving}>{saving ? "Cadastrando..." : "Cadastrar"}</Button>
        <p className="muted center">
          Já tem conta? <Link to={linkLogin}>Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
