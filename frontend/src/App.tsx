import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { StoreLayout } from "./components/layout/StoreLayout";
import { AdminRoute } from "./components/rotas/AdminRoute";
import { ProtectedRoute } from "./components/rotas/ProtectedRoute";
import { AdminPage } from "./pages/Admin/AdminPage";
import { AboutPage } from "./pages/Loja/AboutPage";
import { AccountOrdersPage } from "./pages/Loja/AccountOrdersPage";
import { AccountPage } from "./pages/Loja/AccountPage";
import { CheckoutPage } from "./pages/Loja/CheckoutPage";
import { ContactPage } from "./pages/Loja/ContactPage";
import { FavoritesPage } from "./pages/Loja/FavoritesPage";
import { ProductDetailPage } from "./pages/Loja/ProductDetailPage";
import { ProductsPage } from "./pages/Loja/ProductsPage";
import { StoreHomePage } from "./pages/Loja/StoreHomePage";
import { CategoriaFormPage } from "./pages/Categorias/CategoriaFormPage";
import { CategoriasListPage } from "./pages/Categorias/CategoriasListPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { LoginPage } from "./pages/Login/LoginPage";
import { MaquinaFormPage } from "./pages/Maquinas/MaquinaFormPage";
import { MaquinasListPage } from "./pages/Maquinas/MaquinasListPage";
import { PedidoFormPage } from "./pages/Pedidos/PedidoFormPage";
import { PedidosListPage } from "./pages/Pedidos/PedidosListPage";
import { ProdutoFormPage } from "./pages/Produtos/ProdutoFormPage";
import { ProdutosListPage } from "./pages/Produtos/ProdutosListPage";
import { ProfilePage } from "./pages/Perfil/ProfilePage";
import { RegisterPage } from "./pages/Cadastro/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      {/* Loja: navegação (início, produtos, detalhe) é pública; checkout e conta exigem login */}
      <Route element={<StoreLayout />}>
        <Route path="/loja" element={<StoreHomePage />} />
        <Route path="/loja/produtos" element={<ProductsPage />} />
        <Route path="/loja/produtos/:id" element={<ProductDetailPage />} />
        <Route path="/loja/sobre" element={<AboutPage />} />
        <Route path="/loja/contato" element={<ContactPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/loja/checkout" element={<CheckoutPage />} />
          <Route path="/loja/conta" element={<AccountPage />}>
            <Route index element={<AccountOrdersPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* Gestão (CRUDs) e painel admin */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/perfil" element={<ProfilePage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="/categorias" element={<CategoriasListPage />} />
          <Route path="/categorias/novo" element={<CategoriaFormPage />} />
          <Route path="/categorias/:id/editar" element={<CategoriaFormPage />} />

          <Route path="/produtos" element={<ProdutosListPage />} />
          <Route path="/produtos/novo" element={<ProdutoFormPage />} />
          <Route path="/produtos/:id/editar" element={<ProdutoFormPage />} />

          <Route path="/maquinas" element={<MaquinasListPage />} />
          <Route path="/maquinas/novo" element={<MaquinaFormPage />} />
          <Route path="/maquinas/:id/editar" element={<MaquinaFormPage />} />

          <Route path="/pedidos" element={<PedidosListPage />} />
          <Route path="/pedidos/novo" element={<PedidoFormPage />} />
          <Route path="/pedidos/:id/editar" element={<PedidoFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/loja" replace />} />
    </Routes>
  );
}
