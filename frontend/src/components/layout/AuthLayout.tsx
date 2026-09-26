import { ReactNode } from "react";

/** Moldura das telas públicas (login e cadastro). */
export function AuthLayout({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <img src="/logo-icon.svg" alt="" width={44} height={44} />
          <span>
            <strong className="grad">Y3D</strong> Creations
          </span>
        </div>
        <h1>{titulo}</h1>
        {children}
      </section>
    </main>
  );
}
