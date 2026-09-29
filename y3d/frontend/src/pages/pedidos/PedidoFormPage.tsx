import { useParams } from "react-router-dom";
import { FormField } from "../../components/ui/FormField";
import { PageHeader } from "../../components/ui/PageHeader";
import { ResourceForm } from "../../components/ui/ResourceForm";
import { useOptions } from "../../hooks/useOptions";
import { useResourceForm } from "../../hooks/useResourceForm";
import { pedidosApi, produtosApi } from "../../services/resources";
import { Pedido, PedidoInput, StatusPedido } from "../../types";
import { formatMoney } from "../../utils/format";
import { ROTULO_STATUS } from "../../utils/store";
import { collectErrors, requiredMsg } from "../../utils/validators";

type Values = { produtoId: string; quantidade: string; status: string };

const STATUS = (Object.keys(ROTULO_STATUS) as StatusPedido[]).map((s) => ({ value: s, label: ROTULO_STATUS[s] }));

/** Cadastro: produto + quantidade (o valor é calculado pelo servidor). Edição: só o status muda. */
export function PedidoFormPage() {
  const { id } = useParams();
  const idNumerico = id ? Number(id) : undefined;
  const editando = idNumerico !== undefined;
  const produtos = useOptions(produtosApi);

  const form = useResourceForm<Pedido, PedidoInput, Values>({
    id: idNumerico,
    api: pedidosApi,
    emptyValues: { produtoId: "", quantidade: "1", status: "PENDENTE" },
    fromEntity: (p) => ({ produtoId: "", quantidade: "1", status: p.status }),
    validate: (v) => {
      if (editando) return collectErrors<Values>([["status", requiredMsg(v.status, "Status")]]);
      const qtd = Number(v.quantidade);
      return collectErrors<Values>([
        ["produtoId", requiredMsg(v.produtoId, "Produto")],
        ["quantidade", requiredMsg(v.quantidade, "Quantidade") ?? (Number.isInteger(qtd) && qtd >= 1 ? null : "Informe um número inteiro (1 ou mais)")],
      ]);
    },
    toInput: (v) =>
      editando
        ? { itens: [], status: v.status as StatusPedido }
        : { itens: [{ produtoId: Number(v.produtoId), quantidade: Number(v.quantidade) }] },
    backTo: "/pedidos",
  });

  return (
    <>
      <PageHeader
        titulo={editando ? "Editar pedido" : "Novo pedido"}
        subtitulo={editando ? "Depois de criado, só o status do pedido pode mudar." : "O valor total (com frete) é calculado pelo servidor."}
      />
      <ResourceForm onSubmit={form.submit} saving={form.saving} loading={form.loading}
        apiError={form.apiError} cancelTo="/pedidos">
        {editando ? (
          <FormField label="Status" name="status" type="select" options={STATUS} value={form.values.status}
            onChange={(v) => form.setField("status", v)} error={form.errors.status} />
        ) : (
          <>
            <FormField label="Produto" name="produtoId" type="select" value={form.values.produtoId}
              options={produtos.map((p) => ({ value: String(p.id), label: `${p.nome} — ${formatMoney(p.preco)}` }))}
              onChange={(v) => form.setField("produtoId", v)} error={form.errors.produtoId} />
            <FormField label="Quantidade" name="quantidade" type="number" value={form.values.quantidade}
              onChange={(v) => form.setField("quantidade", v)} error={form.errors.quantidade} />
          </>
        )}
      </ResourceForm>
    </>
  );
}
