import { MouseEvent, useRef } from "react";
import { ResumoAdmin } from "../../types";
import { formatMoney } from "../../utils/format";

type CardProps = { icone: string; rotulo: string; valor: string };

/** Cartão com efeito 3D: inclina acompanhando o mouse (exclusivo desta seção). */
function KpiCard({ icone, rotulo, valor }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const inclinar = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(10px)`;
  };
  const soltar = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div className="kpi" ref={ref} onMouseMove={inclinar} onMouseLeave={soltar}>
      <div className="ico">{icone}</div>
      <small>{rotulo}</small>
      <strong>{valor}</strong>
    </div>
  );
}

/** 1º bloco do painel: indicadores gerais. */
export function KpiCards({ resumo }: { resumo: ResumoAdmin }) {
  return (
    <section className="kpis">
      <KpiCard icone="👥" rotulo="Clientes" valor={String(resumo.totalClientes)} />
      <KpiCard icone="💰" rotulo="Receita total" valor={formatMoney(resumo.receita)} />
      <KpiCard icone="🧾" rotulo="Pedidos" valor={String(resumo.pedidos)} />
      <KpiCard icone="🎯" rotulo="Ticket médio" valor={formatMoney(resumo.ticketMedio)} />
    </section>
  );
}
