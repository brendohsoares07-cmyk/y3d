export type NovaMensagem = { nome: string; email: string; mensagem: string };

export interface IContactRepository {
  criar(input: NovaMensagem): Promise<void>;
}
