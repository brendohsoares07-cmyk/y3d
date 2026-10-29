import { FormEvent, useState } from "react";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useFormState } from "../../hooks/useFormState";
<<<<<<< HEAD
import { getApiErrorMessage } from "../../services/apiClient";
=======
import { getApiErrorMessage } from "../../services/http";
>>>>>>> bd20297 (arrumando a parte de esqueci a senha)
import { authApi } from "../../services/resources";
import { collectErrors, isCpf, maskCpf, passwordIssues, requiredMsg } from "../../validations";

type Values = { nome: string; cpf: string; senha: string; confirmarSenha: string };

function validarPerfil(values: Values) {
  const problemasSenha = passwordIssues(values.senha);
  return collectErrors<Values>([
    ["nome", requiredMsg(values.nome, "Nome")],
    ["cpf", requiredMsg(values.cpf, "CPF") ?? (isCpf(values.cpf) ? null : "CPF inválido")],
    ["senha", requiredMsg(values.senha, "Senha") ?? (problemasSenha.length ? `A senha precisa de: ${problemasSenha.join(", ")}` : null)],
    ["confirmarSenha", values.confirmarSenha !== values.senha ? "As senhas não conferem" : null],
  ]);
}

export function ProfilePage() {
  const { usuario, atualizarUsuario } = useAuth(); // usuário vem do contexto global
  const { values, errors, setErrors, setField } = useFormState<Values>({
    nome: usuario?.nome ?? "",
    cpf: maskCpf(usuario?.cpf ?? ""),
    senha: "",
    confirmarSenha: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!usuario) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const encontrados = validarPerfil(values);
    setErrors(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setSaving(true);
    setApiError(null);
    setSucesso(null);
    try {
      const atualizado = await authApi.updateUsuario(usuario.id, {
        nome: values.nome,
        cpf: values.cpf,
        senha: values.senha,
      });
      atualizarUsuario(atualizado); // atualiza o nome mostrado em todo o app
      setSucesso("Dados atualizados com sucesso!");
      setField("senha", "");
      setField("confirmarSenha", "");
    } catch (e) {
      setApiError(getApiErrorMessage(e, "Não foi possível salvar."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader titulo="Meu perfil" subtitulo="Atualize seus dados. O e-mail não pode ser alterado." />
      <form className="card form" onSubmit={submit} noValidate>
        {apiError && <Alert>{apiError}</Alert>}
        {sucesso && <Alert tipo="sucesso">{sucesso}</Alert>}
        <FormField label="E-mail" name="email" type="email" value={usuario.email} onChange={() => undefined} disabled />
        <FormField label="Nome completo" name="nome" value={values.nome} onChange={(v) => setField("nome", v)} error={errors.nome} />
        <FormField label="CPF" name="cpf" value={values.cpf} onChange={(v) => setField("cpf", maskCpf(v))} error={errors.cpf} />
        <FormField label="Senha (nova ou atual)" name="senha" type="password" autoComplete="new-password" value={values.senha}
          onChange={(v) => setField("senha", v)} error={errors.senha} hint="Digite a senha que deseja manter ou uma nova." />
        <FormField label="Confirmar senha" name="confirmarSenha" type="password" autoComplete="new-password"
          value={values.confirmarSenha} onChange={(v) => setField("confirmarSenha", v)} error={errors.confirmarSenha} />
        <div className="form-actions">
          <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</Button>
        </div>
      </form>
    </>
  );
}
