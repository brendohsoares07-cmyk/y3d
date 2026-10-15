function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${name}`);
  }
  return value;
}

function list(name: string): string[] {
  return (process.env[name] ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: required("JWT_SECRET"),
  adminEmails: list("ADMIN_EMAILS"),
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_SECONDS ?? 7200),
  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 3306),
    database: required("DB_NAME"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
  },
} as const;
