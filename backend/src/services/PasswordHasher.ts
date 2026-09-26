import bcrypt from "bcryptjs";
import { ValidationError } from "../errors/AppError";
import { passwordIssues } from "../utils/validators";

/** Única responsabilidade: regras de nível de senha e criptografia. */
export class PasswordHasher {
  private static readonly ROUNDS = 10;

  assertStrong(senha: unknown): asserts senha is string {
    if (typeof senha !== "string" || senha === "") {
      throw new ValidationError("O campo senha é obrigatório");
    }
    const problemas = passwordIssues(senha);
    if (problemas.length > 0) {
      throw new ValidationError(`A senha deve ${problemas.join(", ")}`);
    }
  }

  hash(senha: string): Promise<string> {
    return bcrypt.hash(senha, PasswordHasher.ROUNDS);
  }

  compare(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }
}
