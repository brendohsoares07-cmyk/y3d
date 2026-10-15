const BASE_URL = "/api";
const TOKEN_KEY = "y3d_token";

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let onUnauthorized: (() => void) | null = null;

/** O AuthContext registra aqui o que fazer quando o token expira. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

function friendlyMessage(status: number, serverMessage: string | null): string {
  if (serverMessage && status !== 500) return serverMessage;
  switch (status) {
    case 401:
      return "Sua sessão expirou. Faça login novamente.";
    case 403:
      return "Você não tem permissão para fazer isso.";
    case 404:
      return "Item não encontrado.";
    default:
      return "Algo deu errado no servidor. Tente novamente em instantes.";
  }
}

function readMessage(data: unknown): string | null {
  if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
    return data.message;
  }
  return null;
}

type RequestOptions = { method?: "GET" | "POST" | "PUT" | "DELETE"; body?: unknown };

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = tokenStorage.get();
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Verifique sua conexão.", 0);
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // 401 com token guardado = sessão expirada (no login ainda não há token)
    if (response.status === 401 && token) {
      tokenStorage.clear();
      onUnauthorized?.();
    }
    throw new ApiError(friendlyMessage(response.status, readMessage(data)), response.status);
  }
  return data as T;
}
