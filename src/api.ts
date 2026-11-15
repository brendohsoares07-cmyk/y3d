/** Cliente da API (server/). Os cookies de sessão vão e voltam sozinhos (mesma origem). */

export class ErroApi extends Error {
  constructor(mensagem: string, readonly status: number, readonly dados: Record<string, unknown>) {
    super(mensagem);
  }
}

interface Opcoes {
  metodo?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  corpo?: unknown;
  /** Para enviar um arquivo (foto de perfil) em vez de JSON. */
  bruto?: { dados: Blob; tipo: string };
}

export async function api<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const cabecalhos: Record<string, string> = {};
  let corpo: BodyInit | undefined;
  if (opcoes.bruto) {
    cabecalhos["Content-Type"] = opcoes.bruto.tipo;
    corpo = opcoes.bruto.dados;
  } else if (opcoes.corpo !== undefined) {
    cabecalhos["Content-Type"] = "application/json";
    corpo = JSON.stringify(opcoes.corpo);
  }
  let resposta: Response;
  try {
    resposta = await fetch(`/api${caminho}`, { method: opcoes.metodo ?? (corpo ? "POST" : "GET"), headers: cabecalhos, body: corpo, credentials: "same-origin" });
  } catch {
    throw new ErroApi("Sem conexão com o servidor agora. Tente de novo em instantes.", 0, {});
  }
  let dados: Record<string, unknown> = {};
  try {
    dados = (await resposta.json()) as Record<string, unknown>;
  } catch {
    /* resposta sem corpo JSON */
  }
  if (!resposta.ok) {
    const mensagem = typeof dados.erro === "string" ? dados.erro : typeof dados.mensagem === "string" ? dados.mensagem : "Algo deu errado. Tente novamente.";
    throw new ErroApi(mensagem, resposta.status, dados);
  }
  return dados as T;
}

export const mensagemDeErro = (erro: unknown): string => (erro instanceof Error ? erro.message : "Algo deu errado. Tente novamente.");
