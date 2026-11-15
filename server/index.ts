import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { PASTA_DADOS, PASTA_DIST, PASTA_PUBLICA, PORTA, SEGREDO_SESSAO } from "./config.js";
import { rotasAdmin } from "./rotas/admin.js";
import { rotasAuth } from "./rotas/auth.js";
import { rotasPublicas } from "./rotas/publico.js";
import { anexarUsuario } from "./sessao.js";

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(cookieParser(SEGREDO_SESSAO));

// Fotos de perfil enviadas pelos clientes (ficam em data/avatares, fora da pasta pública do site)
app.use("/api/media/avatares", express.static(path.join(PASTA_DADOS, "avatares"), { maxAge: "1h" }));

const api = express.Router();
api.use(express.json({ limit: "100kb" }));
api.use(anexarUsuario);
api.use(rotasPublicas);
api.use(rotasAuth);
api.use(rotasAdmin);
api.use((_req, res) => void res.status(404).json({ erro: "Rota não encontrada." }));
app.use("/api", api);

// Em produção a própria API serve o site compilado (npm run build). Em desenvolvimento quem serve é o Vite.
const pastaSite = existsSync(path.join(PASTA_DIST, "index.html")) ? PASTA_DIST : null;
if (pastaSite) {
  app.use(express.static(pastaSite, { index: false, maxAge: "1h" }));
  app.get("*", (_req, res) => void res.sendFile(path.join(pastaSite, "index.html")));
} else {
  app.use(express.static(PASTA_PUBLICA));
}

app.use((erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const tipo = (erro as { type?: string } | null)?.type;
  if (tipo === "entity.too.large") return void res.status(413).json({ erro: "A foto é grande demais (máximo 2 MB)." });
  if (tipo === "entity.parse.failed") return void res.status(400).json({ erro: "Requisição inválida." });
  console.error(erro);
  res.status(500).json({ erro: "Algo deu errado no servidor. Tente novamente." });
});

app.listen(PORTA, () => {
  console.log(`API da Y3D em http://localhost:${PORTA}${pastaSite ? " (servindo também o site compilado)" : ""}`);
});
