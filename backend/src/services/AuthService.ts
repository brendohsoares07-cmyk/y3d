import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Usuario } from "../entities/Usuario";
import { ConflictError, UnauthorizedError, ValidationError } from "../errors/AppError";
import { LoginInput, RegisterInput, UsuarioPerfil } from "../types";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { isEmail, requireText } from "../utils/validators";
import { AdminPolicy } from "./AdminPolicy";
import { PasswordHasher } from "./PasswordHasher";

export class AuthService {
  constructor(
    private readonly usuarios: UsuarioRepository,
    private readonly hasher: PasswordHasher,
    private readonly policy: AdminPolicy,
  ) {}

  async register(input: RegisterInput): Promise<Usuario> {
    requireText(input.nome, "nome");
    requireText(input.email, "e-mail");
    requireText(input.cpf, "CPF");
    this.hasher.assertStrong(input.senha);

    const usuario = new Usuario({
      nome: input.nome,
      email: input.email,
      cpf: input.cpf,
      senhaHash: await this.hasher.hash(input.senha),
    }); // valida nome, e-mail e CPF

    if (await this.usuarios.findByEmail(usuario.email)) {
      throw new ConflictError("Já existe um usuário com este e-mail");
    }
    if (await this.usuarios.findByCpf(usuario.cpf)) {
      throw new ConflictError("Já existe um usuário com este CPF");
    }
    return this.usuarios.create(usuario);
  }

  async login(input: LoginInput): Promise<{ token: string; usuario: UsuarioPerfil }> {
    const email = requireText(input.email, "e-mail").toLowerCase();
    if (!isEmail(email)) throw new ValidationError("E-mail inválido");
    if (typeof input.senha !== "string" || input.senha === "") {
      throw new ValidationError("O campo senha é obrigatório");
    }

    const usuario = await this.usuarios.findByEmail(email);
    const senhaConfere = usuario ? await this.hasher.compare(input.senha, usuario.senhaHash) : false;
    if (!usuario || !senhaConfere) {
      // mesma mensagem nos dois casos para não revelar quais e-mails existem
      throw new UnauthorizedError("E-mail ou senha incorretos");
    }

    const token = jwt.sign({ sub: String(usuario.id), admin: this.policy.isAdmin(usuario.email) }, env.jwtSecret, {
      expiresIn: env.jwtExpiresInSeconds,
    });
    return { token, usuario: this.policy.toPerfil(usuario) };
  }
}
