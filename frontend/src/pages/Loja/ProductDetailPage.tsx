import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/store/Breadcrumb";
import { ProductAside } from "../../components/store/ProductAside";
import { ProductGallery } from "../../components/store/ProductGallery";
import { ProductInfo } from "../../components/store/ProductInfo";
import { TrustStrip } from "../../components/store/TrustStrip";
import { Alert } from "../../components/ui/Alert";
import { useOptions } from "../../hooks/useOptions";
import { useAuth } from "../../contexts/AuthContext";
import { request } from "../../services/apiClient";
import { getApiErrorMessage } from "../../services/apiClient";
import { categoriasApi, produtosApi } from "../../services/resources";
import { Produto } from "../../types";

/** Detalhe do produto. Funciona para qualquer produto do catálogo: /loja/produtos/:id */
type Avaliacao = { id: number; nome: string; nota: number; comentario: string; criadoEm: string };

export function ProductDetailPage() {
  const { id } = useParams();
  const categorias = useOptions(categoriasApi);
  const { usuario } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [mensagemAvaliacao, setMensagemAvaliacao] = useState("");
  const [produto, setProduto] = useState<Produto | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setProduto(null);
    setErro(null);
    produtosApi
      .get(Number(id))
      .then(setProduto)
      .catch((e: unknown) => setErro(getApiErrorMessage(e, "Não foi possível carregar o produto")));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    request<Avaliacao[]>(`/produtos/${id}/avaliacoes`).then(setAvaliacoes).catch(() => setAvaliacoes([]));
  }, [id]);

  const enviarAvaliacao = async (event: FormEvent) => {
    event.preventDefault(); setMensagemAvaliacao("");
    try {
      const result = await request<{ message: string }>(`/produtos/${id}/avaliacoes`, { method: "POST", body: { nota, comentario } });
      setMensagemAvaliacao(result.message);
      const lista = await request<Avaliacao[]>(`/produtos/${id}/avaliacoes`); setAvaliacoes(lista); setComentario("");
    } catch (e) { setMensagemAvaliacao(e instanceof Error ? e.message : "Não foi possível salvar a avaliação."); }
  };

  if (erro) {
    return (
      <>
        <Alert>{erro}</Alert>
        <p><Link to="/loja/produtos">← Voltar aos produtos</Link></p>
      </>
    );
  }
  if (!produto) return <p className="muted">Carregando...</p>;

  return (
    <>
      <Breadcrumb atual={produto.nome} />
      <div className="detail-grid">
        <div>
          <ProductGallery produto={produto} />
          <TrustStrip />
        </div>
        <ProductInfo produto={produto} categoria={categorias.find((c) => c.id === produto.categoriaId)} />
        <ProductAside produto={produto} />
      </div>
      <section className="panel product-reviews" id="avaliacoes">
        <h2>Avaliações dos clientes</h2>
        {avaliacoes.length ? avaliacoes.map((a) => <article key={a.id} className="product-review"><strong>{a.nome}</strong><span aria-label={`${a.nota} de 5 estrelas`}>{"★".repeat(a.nota)}{"☆".repeat(5-a.nota)}</span>{a.comentario && <p>{a.comentario}</p>}</article>) : <p className="muted">Este produto ainda não recebeu avaliações.</p>}
        {usuario ? <form className="form review-form" onSubmit={enviarAvaliacao}><h3>Deixe sua avaliação</h3>{mensagemAvaliacao && <p role="status">{mensagemAvaliacao}</p>}<label>Nota<select value={nota} onChange={e=>setNota(Number(e.target.value))}><option value={5}>5 estrelas</option><option value={4}>4 estrelas</option><option value={3}>3 estrelas</option><option value={2}>2 estrelas</option><option value={1}>1 estrela</option></select></label><label>Comentário<textarea maxLength={600} rows={3} value={comentario} onChange={e=>setComentario(e.target.value)} /></label><button className="btn btn-primary">Enviar avaliação</button></form> : <p className="muted"><Link to="/login">Entre na sua conta</Link> para avaliar este produto.</p>}
      </section>
    </>
  );
}
