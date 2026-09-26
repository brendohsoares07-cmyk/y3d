import { useState } from "react";
import { FieldErrors } from "../utils/validators";

/** Valores + erros por campo de um formulário. */
export function useFormState<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  const setField = (campo: keyof T, valor: string) => {
    setValues((atual) => ({ ...atual, [campo]: valor }));
    setErrors((atual) => ({ ...atual, [campo]: undefined }));
  };

  return { values, setValues, errors, setErrors, setField };
}
