import { ReactNode } from "react";

/** Moldura das telas públicas (login e cadastro). */
export function AuthLayout({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <img src="/logo-y3d-transparente.png" alt="Y3D Creations" />
        </div>
        <h1>{titulo}</h1>
        {children}
      </section>
    </main>
  );
}
