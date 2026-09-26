import { Outlet } from "react-router-dom";
import { AccountSidebar } from "../../components/store/AccountSidebar";

/** Moldura de "Minha conta": menu lateral + a seção escolhida (pedidos, perfil ou favoritos). */
export function AccountPage() {
  return (
    <>
      <h1>Minha conta</h1>
      <div className="account-grid">
        <AccountSidebar />
        <section className="panel account-content">
          <Outlet />
        </section>
      </div>
    </>
  );
}
