export type Option = { value: string; label: string };

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "number" | "textarea" | "select";
  options?: Option[];
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
};

/** Campo de formulário reutilizável: rótulo + entrada (input, textarea ou select) + erro. */
export function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  error,
  disabled,
  placeholder,
  hint,
  autoComplete,
}: Props) {
  const comum = { id: name, name, value, disabled, "aria-invalid": error ? true : undefined };

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {type === "textarea" ? (
        <textarea {...comum} rows={3} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : type === "select" ? (
        <select {...comum} onChange={(e) => onChange(e.target.value)}>
          <option value="">Selecione...</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...comum}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && !error && <small className="hint">{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
