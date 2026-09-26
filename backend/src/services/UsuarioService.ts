import { Usuario } from "../entities/Usuario";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../errors/AppError";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { UpdateUsuarioInput, UsuarioPerfil } from "../types";
import { requireText } from "../utils/validators";
import { AdminPolicy } from "./AdminPolicy";
import { PasswordHasher } from "./PasswordHasher";

export class UsuarioService {
  constructor(
    private readonly usuarios: UsuarioRepository,
    private readonly hasher: PasswordHasher,
    private readonly policy: AdminPolicy,
  ) {}

  async getById(id: number): Promise<Usuario> {
    const usuario = await this.usuarios.findById(id);
    if (!usuario) throw new NotFoundError("Usuário não encontrado");
    return usuario;
  }

  async perfil(id: number): Promise<UsuarioPerfil> {
    return this.policy.toPerfil(await this.getById(id));
  }

  /** Edição do próprio usuário: todos os campos obrigatórios e e-mail imutável. */
  async update(idAutenticado: number, idAlvo: number, input: UpdateUsuarioInput): Promise<UsuarioPerfil> {
    if (idAutenticado !== idAlvo) {
      throw new ForbiddenError("Você só pode editar o seu próprio usuário");
    }
    const atual = await this.getById(idAlvo);

    if (input.email !== undefined && String(input.email).trim().toLowerCase() !== atual.email) {
      throw new ValidationError("O e-mail não pode ser alterado");
    }
    requireText(input.nome, "nome");
    requireText(input.cpf, "CPF");
    this.hasher.assertStrong(input.senha);

    const editado = new Usuario({
      id: atual.id,
      nome: input.nome,
      email: atual.email,
      cpf: input.cpf,
      senhaHash: await this.hasher.hash(input.senha),
    }); // valida nome e CPF

    const donoDoCpf = await this.usuarios.findByCpf(editado.cpf);
    if (donoDoCpf && donoDoCpf.id !== atual.id) {
      throw new ConflictError("Já existe um usuário com este CPF");
    }

    await this.usuarios.update(editado);
    return this.policy.toPerfil(editado);
  }
}
