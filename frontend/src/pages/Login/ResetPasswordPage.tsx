import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { request } from "../../services/apiClient";

export function ResetPasswordPage() {
  const [params] = useSearchParams(); const token = params.get("token") ?? ""; const [senha, setSenha] = useState(""); const [confirmacao, setConfirmacao] = useState(""); const [erro, setErro] = useState(""); const [ok, setOk] = useState(false); const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setErro(""); if (!token) { setErro("Link de recuperação inválido ou incompleto."); return; } if (senha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; } if (senha !== confirmacao) { setErro("As senhas não conferem."); return; } setLoading(true); try { await request("/auth/reset-password", { method: "POST", body: { token, senha } }); setOk(true); } catch (e) { setErro(e instanceof Error ? e.message : "Não foi possível redefinir a senha."); } finally { setLoading(false); } };
  return <AuthLayout titulo="Nova senha">{ok ? <><Alert tipo="sucesso">Senha alterada. Você já pode entrar na sua conta.</Alert><p className="center"><Link to="/login">Ir para o login</Link></p></> : <form className="form" onSubmit={submit}>{erro && <Alert>{erro}</Alert>}<FormField label="Nova senha" name="senha" type="password" autoComplete="new-password" value={senha} onChange={setSenha}/><FormField label="Confirmar senha" name="confirmacao" type="password" autoComplete="new-password" value={confirmacao} onChange={setConfirmacao}/><Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Redefinir senha"}</Button></form>}</AuthLayout>;
}
