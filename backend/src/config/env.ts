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
  baseUrl: process.env.Y3D_BASE_URL ?? "",
  smtp: {
    host: process.env.Y3D_SMTP_HOST ?? "",
    port: Number(process.env.Y3D_SMTP_PORT ?? 587),
    encryption: (process.env.Y3D_SMTP_ENCRYPTION ?? "tls") as "tls" | "ssl",
    user: process.env.Y3D_SMTP_USER ?? "",
    password: process.env.Y3D_SMTP_PASSWORD ?? "",
    from: process.env.Y3D_EMAIL_FROM ?? process.env.Y3D_SMTP_USER ?? "",
  },
  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 3306),
    database: required("DB_NAME"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
  },
} as const;
