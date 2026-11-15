import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// O build Docker fica sob /gestao; o servidor local continua na raiz.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/gestao/" : "/",
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": "http://localhost:3000" } },
}));
