import { env } from "../config/env";
import { Usuario } from "../entities/Usuario";
import { UsuarioPerfil } from "../types";

/** Decide quem é administrador: e-mails listados em ADMIN_EMAILS (.env). */
export class AdminPolicy {
  constructor(private readonly adminEmails: readonly string[] = env.adminEmails) {}

  isAdmin(email: string): boolean {
    return this.adminEmails.includes(email.toLowerCase());
  }

  /** Dados públicos do usuário + se ele é administrador. */
  toPerfil(usuario: Usuario): UsuarioPerfil {
    return { ...usuario.toJSON(), admin: this.isAdmin(usuario.email) };
  }
}
