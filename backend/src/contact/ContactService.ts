import { ValidationError } from "../errors/AppError";
import { enviarEmail, EmailConfig } from "../shared/email/EmailSender";
import { IContactRepository } from "./IContactRepository";

export class ContactService {
  constructor(
    private readonly repository: IContactRepository,
    private readonly emailConfig: EmailConfig,
  ) {}

  async criar(input: { nome: unknown; email: unknown; mensagem: unknown }): Promise<void> {
    const nome = String(input.nome ?? "").trim();
    const email = String(input.email ?? "").trim().toLowerCase();
    const mensagem = String(input.mensagem ?? "").trim();
    if (
      nome.length < 2 ||
      nome.length > 120 ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      mensagem.length < 5 ||
      mensagem.length > 5000
    ) {
      throw new ValidationError("Informe nome, e-mail válido e mensagem entre 5 e 5000 caracteres.");
    }

    await this.repository.criar({ nome, email, mensagem });
    if (this.emailConfig.host && this.emailConfig.user && this.emailConfig.password && this.emailConfig.from) {
      try {
        await enviarEmail(
          this.emailConfig,
          this.emailConfig.user,
          "Nova mensagem recebida — Y3D",
          `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`,
        );
      } catch (erro) {
        console.error("Falha ao notificar mensagem por e-mail:", erro);
      }
    }
  }
}
