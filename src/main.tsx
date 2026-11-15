import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AvisosProvider } from "./contextos/Avisos";
import { CarrinhoProvider } from "./contextos/Carrinho";
import { CatalogoProvider } from "./contextos/Catalogo";
import { FavoritosProvider } from "./contextos/Favoritos";
import { SessaoProvider } from "./contextos/Sessao";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AvisosProvider>
        <SessaoProvider>
          <CatalogoProvider>
            <CarrinhoProvider>
              <FavoritosProvider>
                <App />
              </FavoritosProvider>
            </CarrinhoProvider>
          </CatalogoProvider>
        </SessaoProvider>
      </AvisosProvider>
    </BrowserRouter>
  </StrictMode>,
);
