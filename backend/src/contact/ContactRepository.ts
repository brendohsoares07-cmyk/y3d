import { pool } from "../config/database";
import { IContactRepository, NovaMensagem } from "./IContactRepository";

export class ContactRepository implements IContactRepository {
  async criar(input: NovaMensagem): Promise<void> {
    await pool.execute("INSERT INTO mensagens (nome, email, mensagem) VALUES (?, ?, ?)", [
      input.nome,
      input.email,
      input.mensagem,
    ]);
  }
}
