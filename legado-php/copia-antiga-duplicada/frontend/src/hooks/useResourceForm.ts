import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CrudApi } from "../services/CrudApi";
import { ApiError } from "../services/http";
import { FieldErrors } from "../utils/validators";
import { useFormState } from "./useFormState";

type Config<TEntity, TInput, TValues extends Record<string, string>> = {
  id?: number; // ausente = cadastro; presente = edição
  api: CrudApi<TEntity, TInput>;
  emptyValues: TValues;
  fromEntity: (entity: TEntity) => TValues;
  validate: (values: TValues) => FieldErrors<TValues>;
  toInput: (values: TValues) => TInput;
  backTo: string;
};

/** Estado, validação e envio de um formulário de cadastro/edição. */
export function useResourceForm<TEntity, TInput, TValues extends Record<string, string>>(
  config: Config<TEntity, TInput, TValues>,
) {
  const navigate = useNavigate();
  const { values, setValues, errors, setErrors, setField } = useFormState<TValues>(config.emptyValues);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(config.id !== undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config.id === undefined) return;
    config.api
      .get(config.id)
      .then((entity) => setValues(config.fromEntity(entity)))
      .catch((e: unknown) => setApiError(e instanceof ApiError ? e.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const encontrados = config.validate(values);
    setErrors(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setSaving(true);
    setApiError(null);
    try {
      const input = config.toInput(values);
      if (config.id === undefined) await config.api.create(input);
      else await config.api.update(config.id, input);
      navigate(config.backTo);
    } catch (e) {
      setApiError(e instanceof ApiError ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return { values, errors, apiError, loading, saving, setField, submit };
}
