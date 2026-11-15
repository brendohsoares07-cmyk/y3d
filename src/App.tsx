import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutAdmin, LayoutAutenticacao, LayoutLoja } from "./componentes/LayoutLoja";
import { PaginaAdmin } from "./paginas/Admin";
import { PaginaCadastro } from "./paginas/Cadastro";
import { PaginaCarrinho } from "./paginas/Carrinho";
import { PaginaCheckout } from "./paginas/Checkout";
import { PaginaConta } from "./paginas/Conta";
import { PaginaContato } from "./paginas/Contato";
import { PaginaFavoritos } from "./paginas/Favoritos";
import { PaginaInicio } from "./paginas/Inicio";
import { PaginaLogin } from "./paginas/Login";
import { PaginaProduto } from "./paginas/Produto";
import { PaginaProdutos } from "./paginas/Produtos";
import { PaginaSobre } from "./paginas/Sobre";

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutLoja />}>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/produtos" element={<PaginaProdutos />} />
        <Route path="/produto/:id" element={<PaginaProduto />} />
        <Route path="/carrinho" element={<PaginaCarrinho />} />
        <Route path="/checkout" element={<PaginaCheckout />} />
        <Route path="/conta" element={<PaginaConta />} />
        <Route path="/favoritos" element={<PaginaFavoritos />} />
        <Route path="/contato" element={<PaginaContato />} />
        <Route path="/sobre" element={<PaginaSobre />} />
      </Route>
      <Route element={<LayoutAutenticacao />}>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/cadastro" element={<PaginaCadastro />} />
      </Route>
      <Route element={<LayoutAdmin />}>
        <Route path="/admin" element={<PaginaAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
