import { useParams } from "react-router-dom";
import { FormField } from "../../components/ui/FormField";
import { PageHeader } from "../../components/ui/PageHeader";
import { ResourceForm } from "../../components/ui/ResourceForm";
import { useResourceForm } from "../../hooks/useResourceForm";
import { maquinasApi } from "../../services/resources";
import { Maquina, MaquinaInput, TipoMaquina } from "../../types";
import { collectErrors, requiredMsg } from "../../utils/validators";

type Values = { nome: string; tipo: string; volumeImpressao: string };

const TIPOS = [
  { value: "FDM", label: "FDM (filamento)" },
  { value: "RESINA", label: "Resina" },
  { value: "FECHADA", label: "Fechada (CoreXY)" },
];

export function MaquinaFormPage() {
  const { id } = useParams();
  const idNumerico = id ? Number(id) : undefined;

  const form = useResourceForm<Maquina, MaquinaInput, Values>({
    id: idNumerico,
    api: maquinasApi,
    emptyValues: { nome: "", tipo: "", volumeImpressao: "" },
    fromEntity: (m) => ({ nome: m.nome, tipo: m.tipo, volumeImpressao: m.volumeImpressao }),
    validate: (v) =>
      collectErrors<Values>([
        ["nome", requiredMsg(v.nome, "Nome")],
        ["tipo", requiredMsg(v.tipo, "Tipo")],
        ["volumeImpressao", requiredMsg(v.volumeImpressao, "Volume de impressão")],
      ]),
    toInput: (v) => ({ nome: v.nome.trim(), tipo: v.tipo as TipoMaquina, volumeImpressao: v.volumeImpressao.trim() }),
    backTo: "/maquinas",
  });

  return (
    <>
      <PageHeader titulo={idNumerico ? "Editar máquina" : "Nova máquina"} />
      <ResourceForm onSubmit={form.submit} saving={form.saving} loading={form.loading}
        apiError={form.apiError} cancelTo="/maquinas">
        <FormField label="Nome" name="nome" value={form.values.nome} onChange={(v) => form.setField("nome", v)} error={form.errors.nome} />
        <FormField label="Tipo" name="tipo" type="select" options={TIPOS} value={form.values.tipo}
          onChange={(v) => form.setField("tipo", v)} error={form.errors.tipo} />
        <FormField label="Volume de impressão" name="volumeImpressao" placeholder="220 x 220 x 250 mm"
          value={form.values.volumeImpressao} onChange={(v) => form.setField("volumeImpressao", v)}
          error={form.errors.volumeImpressao} />
      </ResourceForm>
    </>
  );
}
