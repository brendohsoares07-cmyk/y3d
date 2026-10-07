import { useParams } from "react-router-dom";
import { FormField } from "../../components/ui/FormField";
import { PageHeader } from "../../components/ui/PageHeader";
import { ResourceForm } from "../../components/ui/ResourceForm";
import { useResourceForm } from "../../hooks/useResourceForm";
import { categoriasApi } from "../../services/resources";
import { Categoria, CategoriaInput } from "../../types";
import { collectErrors, requiredMsg } from "../../utils/validators";

type Values = { nome: string; descricao: string };

export function CategoriaFormPage() {
  const { id } = useParams();
  const idNumerico = id ? Number(id) : undefined;

  const form = useResourceForm<Categoria, CategoriaInput, Values>({
    id: idNumerico,
    api: categoriasApi,
    emptyValues: { nome: "", descricao: "" },
    fromEntity: (c) => ({ nome: c.nome, descricao: c.descricao ?? "" }),
    validate: (v) =>
      collectErrors<Values>([
        ["nome", requiredMsg(v.nome, "Nome") ?? (v.nome.trim().length < 2 ? "Mínimo de 2 caracteres" : null)],
      ]),
    toInput: (v) => ({ nome: v.nome.trim(), descricao: v.descricao.trim() || null }),
    backTo: "/categorias",
  });

  return (
    <>
      <PageHeader titulo={idNumerico ? "Editar categoria" : "Nova categoria"} />
      <ResourceForm onSubmit={form.submit} saving={form.saving} loading={form.loading}
        apiError={form.apiError} cancelTo="/categorias">
        <FormField label="Nome" name="nome" value={form.values.nome} onChange={(v) => form.setField("nome", v)} error={form.errors.nome} />
        <FormField label="Descrição" name="descricao" type="textarea" value={form.values.descricao}
          onChange={(v) => form.setField("descricao", v)} />
      </ResourceForm>
    </>
  );
}
