import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Usuario } from "./Usuario";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../errors/AppError";
import { IUsuarioRepository } from "./IUsuarioRepository";
import { UpdateUsuarioInput, UsuarioPerfil } from "../shared/types";
import { requireText } from "../shared/validators/validators";
import { AdminPolicy } from "../admin/AdminPolicy";
import { PasswordHasher } from "../auth/PasswordHasher";

export class UsuarioService {
  constructor(
    private readonly usuarios: IUsuarioRepository,
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
      foto: atual.foto,
    }); // valida nome e CPF

    const donoDoCpf = await this.usuarios.findByCpf(editado.cpf);
    if (donoDoCpf && donoDoCpf.id !== atual.id) {
      throw new ConflictError("Já existe um usuário com este CPF");
    }

    await this.usuarios.update(editado);
    return this.policy.toPerfil(editado);
  }

  async atualizarFoto(usuarioId: number | undefined, arquivo: string): Promise<string> {
    const match = arquivo.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/);
    if (!usuarioId || !match) throw new ValidationError("Envie uma imagem PNG, JPG ou WebP válida.");

    const extensao = match[1] === "jpeg" ? "jpg" : match[1];
    const buffer = Buffer.from(match[2], "base64");
    if (!buffer.length || buffer.length > 2 * 1024 * 1024) {
      throw new ValidationError("A imagem deve ter no máximo 2 MB.");
    }

    const valido =
      extensao === "png"
        ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : extensao === "jpg"
          ? buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255
          : buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
    if (!valido) throw new ValidationError("O arquivo enviado não corresponde ao formato informado.");

    const diretorio = path.join(process.cwd(), "uploads", "avatars");
    await fs.mkdir(diretorio, { recursive: true });
    const nome = `usuario-${usuarioId}-${randomUUID()}.${extensao}`;
    await fs.writeFile(path.join(diretorio, nome), buffer, { flag: "wx" });
    const foto = `/uploads/avatars/${nome}`;
    const caminhoAntigo = await this.usuarios.buscarFoto(usuarioId);
    await this.usuarios.atualizarFoto(usuarioId, foto);

    if (caminhoAntigo?.startsWith("/uploads/avatars/")) {
      try {
        await fs.unlink(path.join(diretorio, path.basename(caminhoAntigo)));
      } catch (erro) {
        if (!(erro instanceof Error) || !("code" in erro) || erro.code !== "ENOENT") throw erro;
      }
    }
    return foto;
  }
}
