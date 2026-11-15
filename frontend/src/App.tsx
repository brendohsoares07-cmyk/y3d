import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { useAuth } from "./contexts/AuthContext";
import { StoreLayout } from "./components/layout/StoreLayout";
import { AdminRoute } from "./components/rotas/AdminRoute";
import { ProtectedRoute } from "./components/rotas/ProtectedRoute";
import { AdminPage } from "./pages/admin/AdminPage";
import { AdminMessagesPage } from "./pages/admin/AdminMessagesPage";
import { AdminFeedbackPage } from "./pages/admin/AdminFeedbackPage";
import { AboutPage } from "./pages/Loja/AboutPage";
import { AccountOrdersPage } from "./pages/Loja/AccountOrdersPage";
import { AccountPage } from "./pages/Loja/AccountPage";
import { CheckoutPage } from "./pages/Loja/CheckoutPage";
import { CartPage } from "./pages/Loja/CartPage";
import { ForgotPasswordPage } from "./pages/Login/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/Login/ResetPasswordPage";
import { ContactPage } from "./pages/Loja/ContactPage";
import { FavoritesPage } from "./pages/Loja/FavoritesPage";
import { ProductDetailPage } from "./pages/Loja/ProductDetailPage";
import { ProductsPage } from "./pages/Loja/ProductsPage";
import { StoreHomePage } from "./pages/Loja/StoreHomePage";
import { CategoriaFormPage } from "./pages/categorias/CategoriaFormPage";
import { CategoriasListPage } from "./pages/categorias/CategoriasListPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { LoginPage } from "./pages/Login/LoginPage";
import { MaquinaFormPage } from "./pages/maquinas/MaquinaFormPage";
import { MaquinasListPage } from "./pages/maquinas/MaquinasListPage";
import { PedidoFormPage } from "./pages/pedidos/PedidoFormPage";
import { PedidosListPage } from "./pages/pedidos/PedidosListPage";
import { ProdutoFormPage } from "./pages/produtos/ProdutoFormPage";
import { ProdutosListPage } from "./pages/produtos/ProdutosListPage";
import { ProfilePage } from "./pages/Perfil/ProfilePage";
import { RegisterPage } from "./pages/Cadastro/RegisterPage";

function LegacyProductRedirect() {
  const [params] = useSearchParams(); const id = params.get("id");
  return <Navigate to={id ? `/loja/produtos/${encodeURIComponent(id)}` : "/loja/produtos"} replace />;
}
function LegacyProductsRedirect() {
  const [params] = useSearchParams(); const query = new URLSearchParams();
  const busca = params.get("busca") ?? params.get("q"); const categoria = params.get("categoria");
  if (busca) query.set("q", busca); if (categoria) query.set("categoria", categoria);
  return <Navigate to={`/loja/produtos${query.size ? `?${query.toString()}` : ""}`} replace />;
}
function LegacyLogoutRedirect() {
  const { logout } = useAuth(); const navigate = useNavigate();
  useEffect(() => { logout(); navigate("/login", { replace: true }); }, [logout, navigate]);
  return null;
}
function LegacyLoginRedirect() {
  const [params] = useSearchParams(); const acao = params.get("acao"); const token = params.get("token");
  if (acao === "recuperar") return <Navigate to="/login/esqueci-senha" replace />;
  if (acao === "redefinir") return <Navigate to={`/login/redefinir-senha${token ? `?token=${encodeURIComponent(token)}` : ""}`} replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/loja" replace />} />
      <Route path="/loja-php/*" element={<Navigate to="/loja" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/login/esqueci-senha" element={<ForgotPasswordPage />} />
      <Route path="/login/redefinir-senha" element={<ResetPasswordPage />} />
      <Route path="/login.php" element={<LegacyLoginRedirect />} />
      <Route path="/cadastro.php" element={<Navigate to="/cadastro" replace />} />
      <Route path="/logout.php" element={<LegacyLogoutRedirect />} />

      {/* Loja: navegação (início, produtos, detalhe) é pública; checkout e conta exigem login */}
      <Route element={<StoreLayout />}>
        <Route path="/loja" element={<StoreHomePage />} />
        <Route path="/index.php" element={<Navigate to="/loja" replace />} />
        <Route path="/produtos.php" element={<LegacyProductsRedirect />} />
        <Route path="/sobre.php" element={<Navigate to="/loja/sobre" replace />} />
        <Route path="/admin.php" element={<Navigate to="/admin" replace />} />
        <Route path="/contato.php" element={<Navigate to="/loja/contato" replace />} />
        <Route path="/carrinho.php" element={<Navigate to="/loja/carrinho" replace />} />
        <Route path="/favoritos.php" element={<Navigate to="/favoritos" replace />} />
        <Route path="/produto.php" element={<LegacyProductRedirect />} />
        <Route path="/loja/produtos" element={<ProductsPage />} />
        <Route path="/loja/carrinho" element={<CartPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/produtos" element={<ProductsPage />} />
        <Route path="/produto/:id" element={<ProductDetailPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/loja/produtos/:id" element={<ProductDetailPage />} />
        <Route path="/loja/sobre" element={<AboutPage />} />
        <Route path="/loja/contato" element={<ContactPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/loja/checkout" element={<CheckoutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout.php" element={<CheckoutPage />} />
          <Route path="/loja/conta" element={<AccountPage />}>
            <Route index element={<AccountOrdersPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
          </Route>
          <Route path="/conta" element={<AccountPage />}>
            <Route index element={<AccountOrdersPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
          </Route>
          <Route path="/conta.php" element={<Navigate to="/loja/conta" replace />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* Gestão (CRUDs) e painel admin */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/perfil" element={<ProfilePage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/mensagens" element={<AdminMessagesPage />} />
            <Route path="/admin/avaliacoes" element={<AdminFeedbackPage />} />

            <Route path="/categorias" element={<CategoriasListPage />} />
            <Route path="/categorias/novo" element={<CategoriaFormPage />} />
            <Route path="/categorias/:id/editar" element={<CategoriaFormPage />} />

            <Route path="/produtos" element={<ProdutosListPage />} />
            <Route path="/produtos/novo" element={<ProdutoFormPage />} />
            <Route path="/produtos/:id/editar" element={<ProdutoFormPage />} />

            <Route path="/maquinas" element={<MaquinasListPage />} />
            <Route path="/maquinas/novo" element={<MaquinaFormPage />} />
            <Route path="/maquinas/:id/editar" element={<MaquinaFormPage />} />
          </Route>

          <Route path="/pedidos" element={<PedidosListPage />} />
          <Route path="/pedidos/novo" element={<PedidoFormPage />} />
          <Route path="/pedidos/:id/editar" element={<PedidoFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/loja" replace />} />
    </Routes>
  );
}
