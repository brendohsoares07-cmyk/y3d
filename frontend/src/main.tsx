import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/global.css";

const container = document.getElementById("root");
if (!container) throw new Error("Elemento #root não encontrado");

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(container).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
