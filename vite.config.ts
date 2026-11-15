import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Em desenvolvimento o Vite (porta 5173) encaminha /api para a API Express (porta 3001).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:3001", changeOrigin: false } },
  },
});
