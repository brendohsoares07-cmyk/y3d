export {};

declare global {
  namespace Express {
    interface Request {
      /** Preenchido pelo authMiddleware com o id do usuário do token JWT. */
      userId?: number;
      /** Vem do token JWT (definido no login a partir de ADMIN_EMAILS). */
      isAdmin?: boolean;
    }
  }
}
