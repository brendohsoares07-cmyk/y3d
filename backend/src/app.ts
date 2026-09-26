import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use("/api", routes);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});
app.use(errorHandler);
