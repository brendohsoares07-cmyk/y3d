import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { StoreLayout } from "./components/layout/StoreLayout";
import { AdminRoute } from "./components/AdminRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminPage } from "./pages/admin/AdminPage";
import { AboutPage } from "./pages/store/AboutPage";
import { AccountOrdersPage } from "./pages/store/AccountOrdersPage";
import { AccountPage } from "./pages/store/AccountPage";
import { CheckoutPage } from "./pages/store/CheckoutPage";
import { ContactPage } from "./pages/store/ContactPage";
import { FavoritesPage } from "./pages/store/FavoritesPage";
import { ProductDetailPage } from "./pages/store/ProductDetailPage";
import { ProductsPage } from "./pages/store/ProductsPage";
import { StoreHomePage } from "./pages/store/StoreHomePage";
import { CategoriaFormPage } from "./pages/categorias/CategoriaFormPage";
import { CategoriasListPage } from "./pages/categorias/CategoriasListPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MaquinaFormPage } from "./pages/maquinas/MaquinaFormPage";
import { MaquinasListPage } from "./pages/maquinas/MaquinasListPage";
import { PedidoFormPage } from "./pages/pedidos/PedidoFormPage";
import { PedidosListPage } from "./pages/pedidos/PedidosListPage";
import { ProdutoFormPage } from "./pages/produtos/ProdutoFormPage";
import { ProdutosListPage } from "./pages/produtos/ProdutosListPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";

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
