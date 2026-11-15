import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { request } from "../../services/apiClient";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); const [mensagem, setMensagem] = useState(""); const [erro, setErro] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setLoading(true); setErro(""); setMensagem(""); try { const result = await request<{ message: string }>("/auth/forgot-password", { method: "POST", body: { email } }); setMensagem(result.message); } catch (e) { setErro(e instanceof Error ? e.message : "Não foi possível solicitar a recuperação."); } finally { setLoading(false); } };
  return <AuthLayout titulo="Recuperar senha"><form className="form" onSubmit={submit}>{erro && <Alert>{erro}</Alert>}{mensagem && <Alert tipo="sucesso">{mensagem}</Alert>}<p className="muted">Informe o e-mail da sua conta. Se ele estiver cadastrado, enviaremos as instruções para redefinir sua senha.</p><FormField label="E-mail" name="email" type="email" autoComplete="email" value={email} onChange={setEmail}/><Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar instruções"}</Button><p className="muted center"><Link to="/login">Voltar para entrar</Link></p></form></AuthLayout>;
}
