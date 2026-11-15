import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const root = process.cwd();
const dataDir = path.join(root, "data");
const load = (name) => {
  const file = path.join(dataDir, name);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
};
const digits = (value) => String(value ?? "").replace(/\D/g, "");
const cpfValido = (value) => {
  const cpf = digits(value); if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (base, peso) => { let soma=0; for(let i=0;i<base.length;i++) soma += Number(base[i]) * (peso-i); const r=(soma*10)%11; return r===10?0:r; };
  return calc(cpf.slice(0,9),10)===Number(cpf[9]) && calc(cpf.slice(0,10),11)===Number(cpf[10]);
};
const statusMap = { aguardando: "PENDENTE", pendente: "PENDENTE", pago: "PAGO", enviado: "ENVIADO", entregue: "ENTREGUE", cancelado: "CANCELADO" };
const paymentMap = { pix: "PIX", cartao: "CARTAO", boleto: "BOLETO" };

const db = await mysql.createConnection({
  host: process.env.DB_HOST ?? "127.0.0.1", port: Number(process.env.DB_PORT ?? 3306),
  database: process.env.DB_NAME ?? "y3d", user: process.env.DB_USER ?? "y3d_user", password: process.env.DB_PASSWORD ?? "",
  charset: "utf8mb4",
});
let users = 0, orders = 0, messages = 0;
try {
  const usuarios = load("usuarios.json");
  for (const u of usuarios) {
    const cpf = digits(u.cpf);
    const foto = u.foto ? `/uploads/avatars/${path.basename(String(u.foto))}` : null;
    await db.execute(
      `INSERT INTO usuarios (id, nome, email, cpf, senha_hash, foto, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))
       ON DUPLICATE KEY UPDATE nome=VALUES(nome), email=VALUES(email), cpf=COALESCE(usuarios.cpf, VALUES(cpf)), foto=COALESCE(VALUES(foto), usuarios.foto)`,
      [Number(u.id), String(u.nome ?? "Cliente"), String(u.email ?? "").toLowerCase(), cpfValido(cpf) ? cpf : null, String(u.senha_hash ?? ""), foto, Number(u.criado_em ?? Math.floor(Date.now()/1000))],
    ); users++;
  }
  const pedidos = load("pedidos.json");
  for (const p of pedidos) {
    const id = Number(p.id); const usuarioId = Number(p.usuario_id);
    if (!id || !usuarioId) continue;
    const forma = paymentMap[String(p.pagamento ?? "pix").toLowerCase()] ?? "PIX";
    const status = statusMap[String(p.status ?? "aguardando").toLowerCase()] ?? "PENDENTE";
    const cpf = digits(p.cpf);
    await db.execute(
      `INSERT INTO pedidos (id, usuario_id, status, forma_pagamento, frete, valor_total, entrega_nome, entrega_telefone, entrega_cpf, entrega_cep, entrega_endereco, entrega_bairro, entrega_cidade, criado_em)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))
       ON DUPLICATE KEY UPDATE status=VALUES(status), valor_total=VALUES(valor_total)`,
      [id, usuarioId, status, forma, Number(p.total ?? 0), p.nome ?? null, digits(p.telefone), cpfValido(cpf) ? cpf : null, digits(p.cep), p.endereco ?? null, p.bairro ?? null, p.cidade ?? null, Number(p.criado_em ?? Math.floor(Date.now()/1000))],
    );
    for (const item of (Array.isArray(p.itens) ? p.itens : [])) {
      const produtoId = Number(item.id); const quantidade = Number(item.quantidade ?? 1);
      if (!produtoId || !quantidade) continue;
      await db.execute(
        `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, personalizacao)
         SELECT ?, ?, ?, ?, NULL FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM pedido_itens WHERE pedido_id=? AND produto_id=?)`,
        [id, produtoId, quantidade, Number(item.preco ?? 0.01) || 0.01, id, produtoId],
      );
    }
    if (p.pix_informado_em) await db.execute("UPDATE pedidos SET pix_informado_em=FROM_UNIXTIME(?) WHERE id=?", [Number(p.pix_informado_em), id]);
    orders++;
  }
  for (const m of load("mensagens.json")) {
    await db.execute(
      `INSERT INTO mensagens (id, nome, email, mensagem, lida, criado_em) VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(?))
       ON DUPLICATE KEY UPDATE mensagem=VALUES(mensagem), lida=VALUES(lida)`,
      [Number(m.id), String(m.nome ?? "Cliente"), String(m.email ?? ""), String(m.mensagem ?? ""), m.lida ? 1 : 0, Number(m.criado_em ?? Math.floor(Date.now()/1000))],
    ); messages++;
  }
  const admins = usuarios.filter((u) => u.admin).map((u) => u.email).filter(Boolean);
  console.log(`Importação concluída: ${users} usuários, ${orders} pedidos e ${messages} mensagens.`);
  if (admins.length) console.log(`Configure estes e-mails em ADMIN_EMAILS no .env: ${admins.join(",")}`);
} finally { await db.end(); }
