import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Em desenvolvimento, /api é encaminhado para o backend local.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": "http://localhost:3000" } },
});
