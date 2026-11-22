import { IRepository } from "../shared/base/IRepository";
import { Usuario } from "./Usuario";

export interface IUsuarioRepository extends IRepository<Usuario> {
  findByEmail(email: string): Promise<Usuario | null>;
  findByCpf(cpf: string): Promise<Usuario | null>;
  criarTokenRedefinicao(usuarioId: number, tokenHash: string): Promise<void>;
  buscarUsuarioPorTokenValido(tokenHash: string): Promise<number | null>;
  removerTokenRedefinicao(usuarioId: number): Promise<void>;
  atualizarSenhaHash(usuarioId: number, senhaHash: string): Promise<void>;
  buscarFoto(usuarioId: number): Promise<string | null>;
  atualizarFoto(usuarioId: number, foto: string): Promise<void>;
}
