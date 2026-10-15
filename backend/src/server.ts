import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`API Y3D Creations rodando na porta ${env.port}`);
});
