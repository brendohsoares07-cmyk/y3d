import { FormField } from "../ui/FormField";
import { FieldErrors } from "../../utils/validators";
import { maskCep, maskTelefone } from "../../utils/store";

export type AddressValues = {
  nome: string;
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
};

type Props = {
  values: AddressValues;
  errors: FieldErrors<AddressValues>;
  onChange: (campo: keyof AddressValues, valor: string) => void;
};

/** 1) Endereço de entrega. */
export function AddressForm({ values, errors, onChange }: Props) {
  return (
    <div className="form">
      <FormField label="Nome completo*" name="nome" value={values.nome} onChange={(v) => onChange("nome", v)} error={errors.nome} />
      <div className="two-cols">
        <FormField label="Telefone*" name="telefone" value={values.telefone} placeholder="(00) 00000-0000"
          onChange={(v) => onChange("telefone", maskTelefone(v))} error={errors.telefone} />
        <FormField label="CEP*" name="cep" value={values.cep} placeholder="00000-000"
          onChange={(v) => onChange("cep", maskCep(v))} error={errors.cep} />
      </div>
      <FormField label="Endereço*" name="endereco" value={values.endereco} placeholder="Rua, número e complemento"
        onChange={(v) => onChange("endereco", v)} error={errors.endereco} />
      <div className="two-cols">
        <FormField label="Bairro*" name="bairro" value={values.bairro} onChange={(v) => onChange("bairro", v)} error={errors.bairro} />
        <FormField label="Cidade*" name="cidade" value={values.cidade} onChange={(v) => onChange("cidade", v)} error={errors.cidade} />
      </div>
    </div>
  );
}
