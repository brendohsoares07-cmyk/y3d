import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

type LegacyRecord = Record<string, unknown>;
type OrderStatus = "PENDENTE" | "PAGO" | "ENVIADO" | "ENTREGUE" | "CANCELADO";
type PaymentMethod = "PIX" | "CARTAO" | "BOLETO";

const localDataDir = path.join(process.cwd(), "data");
const dataDir = fs.existsSync(localDataDir) ? localDataDir : path.resolve(process.cwd(), "../data");

function record(value: unknown): LegacyRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as LegacyRecord) : {};
}

function load(name: string): LegacyRecord[] {
  const file = path.join(dataDir, name);
  if (!fs.existsSync(file)) return [];
  const parsed: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(parsed) ? parsed.map(record) : [];
}

function text(value: unknown, fallback: string): string {
  return value === null || value === undefined ? fallback : String(value);
}

function nullableText(value: unknown): string | null {
  return value === null || value === undefined ? null : String(value);
}

function number(value: unknown, fallback: number): number {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function digits(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "");
}

function cpfValido(value: unknown): boolean {
  const cpf = digits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (base: string, peso: number): number => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (peso - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return calc(cpf.slice(0, 9), 10) === Number(cpf[9]) && calc(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

const statusMap: Record<string, OrderStatus> = {
  aguardando: "PENDENTE",
  pendente: "PENDENTE",
  pago: "PAGO",
  enviado: "ENVIADO",
  entregue: "ENTREGUE",
  cancelado: "CANCELADO",
};
const paymentMap: Record<string, PaymentMethod> = { pix: "PIX", cartao: "CARTAO", boleto: "BOLETO" };

async function importar(): Promise<void> {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    database: process.env.DB_NAME ?? "y3d",
    user: process.env.DB_USER ?? "y3d_user",
    password: process.env.DB_PASSWORD ?? "",
    charset: "utf8mb4",
  });
  let users = 0;
  let orders = 0;
  let messages = 0;

  try {
    const usuarios = load("usuarios.json");
    for (const usuario of usuarios) {
      const cpf = digits(usuario.cpf);
      const foto = usuario.foto
        ? `/uploads/avatars/${path.basename(String(usuario.foto))}`
        : null;
      await db.execute(
        `INSERT INTO usuarios (id, nome, email, cpf, senha_hash, foto, criado_em)
         VALUES (?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))
         ON DUPLICATE KEY UPDATE nome=VALUES(nome), email=VALUES(email), cpf=COALESCE(usuarios.cpf, VALUES(cpf)), foto=COALESCE(VALUES(foto), usuarios.foto)`,
        [
          Number(usuario.id),
          text(usuario.nome, "Cliente"),
          text(usuario.email, "").toLowerCase(),
          cpfValido(cpf) ? cpf : null,
          text(usuario.senha_hash, ""),
          foto,
          number(usuario.criado_em, Math.floor(Date.now() / 1000)),
        ],
      );
      users++;
    }

    for (const pedido of load("pedidos.json")) {
      const id = Number(pedido.id);
      const usuarioId = Number(pedido.usuario_id);
      if (!id || !usuarioId) continue;

      const pagamento = paymentMap[text(pedido.pagamento, "pix").toLowerCase()] ?? "PIX";
      const status = statusMap[text(pedido.status, "aguardando").toLowerCase()] ?? "PENDENTE";
      const cpf = digits(pedido.cpf);
      await db.execute(
        `INSERT INTO pedidos (id, usuario_id, status, forma_pagamento, frete, valor_total, entrega_nome, entrega_telefone, entrega_cpf, entrega_cep, entrega_endereco, entrega_bairro, entrega_cidade, criado_em)
         VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))
         ON DUPLICATE KEY UPDATE status=VALUES(status), valor_total=VALUES(valor_total)`,
        [
          id,
          usuarioId,
          status,
          pagamento,
          Number(pedido.total ?? 0),
          nullableText(pedido.nome),
          digits(pedido.telefone),
          cpfValido(cpf) ? cpf : null,
          digits(pedido.cep),
          nullableText(pedido.endereco),
          nullableText(pedido.bairro),
          nullableText(pedido.cidade),
          number(pedido.criado_em, Math.floor(Date.now() / 1000)),
        ],
      );

      const itens = Array.isArray(pedido.itens) ? pedido.itens.map(record) : [];
      for (const item of itens) {
        const produtoId = Number(item.id);
        const quantidade = Number(item.quantidade ?? 1);
        if (!produtoId || !quantidade) continue;
        await db.execute(
          `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, personalizacao)
           SELECT ?, ?, ?, ?, NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM pedido_itens WHERE pedido_id=? AND produto_id=?)`,
          [id, produtoId, quantidade, Number(item.preco ?? 0.01) || 0.01, id, produtoId],
        );
      }
      if (pedido.pix_informado_em) {
        await db.execute("UPDATE pedidos SET pix_informado_em=FROM_UNIXTIME(?) WHERE id=?", [
          Number(pedido.pix_informado_em),
          id,
        ]);
      }
      orders++;
    }

    for (const mensagem of load("mensagens.json")) {
      await db.execute(
        `INSERT INTO mensagens (id, nome, email, mensagem, lida, criado_em) VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(?))
         ON DUPLICATE KEY UPDATE mensagem=VALUES(mensagem), lida=VALUES(lida)`,
        [
          Number(mensagem.id),
          text(mensagem.nome, "Cliente"),
          text(mensagem.email, ""),
          text(mensagem.mensagem, ""),
          mensagem.lida ? 1 : 0,
          number(mensagem.criado_em, Math.floor(Date.now() / 1000)),
        ],
      );
      messages++;
    }

    const admins = usuarios
      .filter((usuario) => Boolean(usuario.admin))
      .map((usuario) => usuario.email)
      .filter((email): email is string => typeof email === "string" && email.length > 0);
    console.log(`Importação concluída: ${users} usuários, ${orders} pedidos e ${messages} mensagens.`);
    if (admins.length) console.log(`Configure estes e-mails em ADMIN_EMAILS no .env: ${admins.join(",")}`);
  } finally {
    await db.end();
  }
}

importar().catch((erro: unknown) => {
  console.error("Falha ao importar os dados legados:", erro);
  process.exitCode = 1;
});
