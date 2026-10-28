import { useParams } from "react-router-dom";
import { FormField } from "../../components/ui/FormField";
import { PageHeader } from "../../components/ui/PageHeader";
import { ResourceForm } from "../../components/ui/ResourceForm";
import { useOptions } from "../../hooks/useOptions";
import { useResourceForm } from "../../hooks/useResourceForm";
import { categoriasApi, produtosApi } from "../../services/resources";
import { Produto, ProdutoInput } from "../../types";
import { collectErrors, requiredMsg } from "../../validations";

type Values = {
  nome: string;
  descricao: string;
  preco: string;
  estoque: string;
  categoriaId: string;
  emoji: string;
  imagens: string;
  personalizacoes: string;
  detalhes: string;
  avaliacao: string;
  totalAvaliacoes: string;
};

function separarLinhas(texto: string): string[] {
  return texto
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);
}

function validarProduto(values: Values) {
  const preco = Number(values.preco);
  const estoque = Number(values.estoque);
  const avaliacao = Number(values.avaliacao);
  const totalAvaliacoes = Number(values.totalAvaliacoes);

  return collectErrors<Values>([
    [
      "nome",
      requiredMsg(values.nome, "Nome") ??
        (values.nome.trim().length < 2 ? "Mínimo de 2 caracteres" : null),
    ],
    [
      "preco",
      requiredMsg(values.preco, "Preço") ??
        (preco > 0 ? null : "Informe um valor maior que zero"),
    ],
    [
      "estoque",
      requiredMsg(values.estoque, "Estoque") ??
        (Number.isInteger(estoque) && estoque >= 0
          ? null
          : "Informe um número inteiro (0 ou mais)"),
    ],
    ["categoriaId", requiredMsg(values.categoriaId, "Categoria")],
    [
      "avaliacao",
      values.avaliacao.trim() === "" || (avaliacao >= 0 && avaliacao <= 5)
        ? null
        : "Use uma nota de 0 a 5",
    ],
    [
      "totalAvaliacoes",
      values.totalAvaliacoes.trim() === "" ||
      (Number.isInteger(totalAvaliacoes) && totalAvaliacoes >= 0)
        ? null
        : "Informe um número inteiro",
    ],
  ]);
}

export function ProdutoFormPage() {
  const { id } = useParams();
  const idNumerico = id ? Number(id) : undefined;
  const categorias = useOptions(categoriasApi);

  const form = useResourceForm<Produto, ProdutoInput, Values>({
    id: idNumerico,
    api: produtosApi,
    emptyValues: {
      nome: "", descricao: "", preco: "", estoque: "", categoriaId: "", emoji: "",
      imagens: "", personalizacoes: "", detalhes: "", avaliacao: "", totalAvaliacoes: "",
    },
    fromEntity: (p) => ({
      nome: p.nome,
      descricao: p.descricao ?? "",
      preco: String(p.preco),
      estoque: String(p.estoque),
      categoriaId: String(p.categoriaId),
      emoji: p.emoji ?? "",
      imagens: p.imagens.join("\n"),
      personalizacoes: p.personalizacoes.join("\n"),
      detalhes: p.detalhes.join("\n"),
      avaliacao: p.avaliacao === null ? "" : String(p.avaliacao),
      totalAvaliacoes: String(p.totalAvaliacoes),
    }),
    validate: validarProduto,
    toInput: (v) => ({
      nome: v.nome.trim(),
      descricao: v.descricao.trim() || null,
      preco: Number(v.preco),
      estoque: Number(v.estoque),
      categoriaId: Number(v.categoriaId),
      emoji: v.emoji.trim() || null,
      imagens: separarLinhas(v.imagens),
      personalizacoes: separarLinhas(v.personalizacoes),
      detalhes: separarLinhas(v.detalhes),
      avaliacao: v.avaliacao.trim() === "" ? null : Number(v.avaliacao),
      totalAvaliacoes: v.totalAvaliacoes.trim() === "" ? 0 : Number(v.totalAvaliacoes),
    }),
    backTo: "/produtos",
  });

  const campo = (nome: keyof Values) => ({
    name: nome,
    value: form.values[nome],
    onChange: (v: string) => form.setField(nome, v),
    error: form.errors[nome],
  });

  return (
    <>
      <PageHeader titulo={idNumerico ? "Editar produto" : "Novo produto"} />
      <ResourceForm
        onSubmit={form.submit}
        saving={form.saving}
        loading={form.loading}
        apiError={form.apiError}
        cancelTo="/produtos"
      >
        <FormField label="Nome" {...campo("nome")} />
        <FormField label="Categoria" type="select" {...campo("categoriaId")}
          options={categorias.map((c) => ({ value: String(c.id), label: c.nome }))} />
        <FormField label="Preço (R$)" type="number" {...campo("preco")} />
        <FormField label="Estoque" type="number" {...campo("estoque")} />
        <FormField label="Descrição" type="textarea" {...campo("descricao")} />
        <FormField label="Emoji (quando não há foto)" {...campo("emoji")} />
        <FormField
          label="Fotos (uma por linha)"
          type="textarea"
          {...campo("imagens")}
          hint="Ex.: /img/produtos/varinha-magica.png"
        />
        <FormField
          label="Opções de personalização (uma por linha)"
          type="textarea"
          {...campo("personalizacoes")}
        />
        <FormField
          label="Descrição completa (um item por linha)"
          type="textarea"
          {...campo("detalhes")}
        />
        <FormField label="Avaliação média (0 a 5)" type="number" {...campo("avaliacao")} />
        <FormField label="Quantidade de avaliações" type="number" {...campo("totalAvaliacoes")} />
      </ResourceForm>
    </>
  );
}
