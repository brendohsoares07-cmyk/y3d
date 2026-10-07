import { useEffect, useState } from "react";
import { ClientsTable } from "../../components/admin/ClientsTable";
import { KpiCards } from "../../components/admin/KpiCards";
import { RevenueChart } from "../../components/admin/RevenueChart";
import { TopClients } from "../../components/admin/TopClients";
import { Alert } from "../../components/ui/Alert";
import { PageHeader } from "../../components/ui/PageHeader";
import { ApiError } from "../../services/http";
import { adminApi } from "../../services/resources";
import { ResumoAdmin } from "../../types";
import "./admin.css";

/** Painel administrativo. A tela é montada nesta ordem: 1) KPIs · 2) gráfico + top clientes · 3) clientes. */
export function AdminPage() {
  const [resumo, setResumo] = useState<ResumoAdmin | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .resumo()
      .then(setResumo)
      .catch((e: unknown) => setErro(e instanceof ApiError ? e.message : "Erro ao carregar o painel"));
  }, []);

  return (
    <div className="admin">
      <PageHeader titulo="Painel Administrativo" subtitulo="Visão geral da loja de modelos 3D" />
      {erro && <Alert>{erro}</Alert>}
      {resumo && (
        <>
          <KpiCards resumo={resumo} />
          <section className="admin-grid">
            <RevenueChart dados={resumo.faturamentoMensal} />
            <TopClients clientes={resumo.topClientes} />
          </section>
        </>
      )}
      <ClientsTable />
    </div>
  );
}
