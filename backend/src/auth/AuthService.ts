import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Usuario } from "../users/Usuario";
import {
  ConflictError,
  ServiceUnavailableError,
  UnauthorizedError,
  ValidationError,
} from "../errors/AppError";
import { LoginInput, RegisterInput, UsuarioPerfil } from "../shared/types";
import { IUsuarioRepository } from "../users/IUsuarioRepository";
import { isEmail, requireText } from "../shared/validators/validators";
import { AdminPolicy } from "../admin/AdminPolicy";
import { PasswordHasher } from "./PasswordHasher";
import { enviarEmail } from "../shared/email/EmailSender";

export class AuthService {
  constructor(
    private readonly usuarios: IUsuarioRepository,
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

  async forgotPassword(emailInformado: unknown, fallbackUrl: string): Promise<string> {
    const email = String(emailInformado ?? "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new ValidationError("Informe um e-mail válido.");
    if (!env.smtp.host || !env.smtp.user || !env.smtp.password || !env.smtp.from) {
      throw new ServiceUnavailableError(
        "A recuperação por e-mail ainda não está configurada. Entre em contato com y3dsuporte@gmail.com.",
      );
    }

    const usuario = await this.usuarios.findByEmail(email);
    if (usuario) {
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");
      await this.usuarios.criarTokenRedefinicao(usuario.id, tokenHash);
      const base = env.baseUrl.replace(/\/$/, "") || fallbackUrl;
      const link = `${base}/login/redefinir-senha?token=${token}`;
      try {
        await enviarEmail(
          env.smtp,
          email,
          "Recuperação de senha — Y3D Creations",
          `Olá, ${usuario.nome}.\n\nPara criar uma nova senha, acesse o link abaixo em até 20 minutos:\n${link}\n\nSe você não solicitou esta alteração, ignore este e-mail.`,
        );
      } catch (erro) {
        await this.usuarios.removerTokenRedefinicao(usuario.id);
        console.error("Falha ao enviar e-mail de recuperação:", erro);
        throw new ServiceUnavailableError("Não foi possível enviar o e-mail agora. Tente novamente mais tarde.");
      }
    }
    return "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.";
  }

  async resetPassword(tokenInformado: unknown, senhaInformada: unknown): Promise<string> {
    const token = String(tokenInformado ?? "");
    if (token.length < 32 || token.length > 256) {
      throw new ValidationError("Link de recuperação inválido ou expirado.");
    }
    this.hasher.assertStrong(senhaInformada);
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const usuarioId = await this.usuarios.buscarUsuarioPorTokenValido(tokenHash);
    if (!usuarioId) throw new ValidationError("Link de recuperação inválido ou expirado.");

    const senhaHash = await this.hasher.hash(senhaInformada);
    await this.usuarios.atualizarSenhaHash(usuarioId, senhaHash);
    await this.usuarios.removerTokenRedefinicao(usuarioId);
    return "Senha alterada com sucesso.";
  }
}
