type Props = { tipo?: "erro" | "sucesso"; children: string };

export function Alert({ tipo = "erro", children }: Props) {
  return (
    <div className={`alert alert-${tipo}`} role={tipo === "erro" ? "alert" : "status"}>
      {children}
    </div>
  );
}
