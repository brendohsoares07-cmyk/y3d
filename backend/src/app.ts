import express from "express";
import path from "node:path";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "4mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), { maxAge: "7d", immutable: true }));
app.use("/api", routes);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});
app.use(errorHandler);
