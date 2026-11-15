import { ReactNode } from "react";

/** Moldura das telas de entrar, cadastrar e recuperar senha, com a arte original da Y3D. */
export function AuthLayout({ titulo, children }: { titulo: string; children: ReactNode }) {
  return <main className="auth-page auth-page-split">
    <section className="auth-art"><img src="/assets/img/login/login-art.jpg" alt="Impressão 3D da Y3D Creations"/><div><small>Y3D CREATIONS</small><h2>Da sua ideia para o <span className="grad">mundo real.</span></h2><p>Crie sua conta e acompanhe seus pedidos e produtos personalizados.</p></div></section>
    <section className="auth-card"><div className="brand"><img src="/assets/img/logo-y3d-transparente.png" alt="Y3D Creations"/></div><h1>{titulo}</h1>{children}</section>
  </main>;
}
