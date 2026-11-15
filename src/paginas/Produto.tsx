import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import type { AvaliacaoProduto } from "../../shared/tipos";
import { api, mensagemDeErro } from "../api";
import { BotaoFavorito, useAdicionarAoCarrinho } from "../componentes/CartaoProduto";
import { GaleriaProduto } from "../componentes/GaleriaProduto";
import { useCarrinho } from "../contextos/Carrinho";
import { useCatalogo } from "../contextos/Catalogo";
import { useSessao } from "../contextos/Sessao";
import { useTitulo } from "../estilos";
import { dataCurta, estrelasTexto, formatarPreco } from "../formatar";

const campoEstilo = { width: "100%", borderRadius: 10, border: "1px solid var(--line)", background: "var(--raise)", color: "var(--text)" } as const;

function Avaliacoes({ produtoId }: { produtoId: number }) {
  const { usuario } = useSessao();
  const { recarregar } = useCatalogo();
  const [lista, setLista] = useState<AvaliacaoProduto[]>([]);
  const [nota, setNota] = useState("5");
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [publicada, setPublicada] = useState(false);

  const carregar = useCallback(() => {
    api<AvaliacaoProduto[]>(`/produtos/${produtoId}/avaliacoes`).then(setLista).catch(() => setLista([]));
  }, [produtoId]);
  useEffect(carregar, [carregar]);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setPublicada(false);
    try {
      await api(`/produtos/${produtoId}/avaliacoes`, { corpo: { nota: Number(nota), comentario } });
      setPublicada(true);
      setComentario("");
      carregar();
      void recarregar(); // a nota média nos cartões e no topo da página
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  return (
    <section className="sec" id="avaliacoes">
      <div className="sec-h"><h2>Avaliações dos clientes</h2></div>
      <div className="grid g2" style={{ alignItems: "start" }}>
        <div className="card-panel">
          {lista.length === 0 ? (
            <p style={{ color: "var(--mute)" }}>Este produto ainda não tem avaliações. Seja o primeiro a avaliar!</p>
          ) : (
            lista.map((av) => (
              <div key={av.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <div><strong>{av.nome}</strong> <span style={{ color: "#ffc83d" }}>{estrelasTexto(av.nota)}</span>
                  <small style={{ color: "var(--mute)", marginLeft: 6 }}>{dataCurta(av.criado_em)}</small></div>
                {av.comentario.trim() !== "" && <p style={{ margin: "6px 0 0", color: "var(--mute)", fontSize: 14, whiteSpace: "pre-line" }}>{av.comentario}</p>}
              </div>
            ))
          )}
        </div>
        <div className="card-panel">
          <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Deixe sua avaliação</h3>
          {publicada && <div className="alert">Obrigado! Sua avaliação foi publicada.</div>}
          {erro && <div className="alert" style={{ borderColor: "#ff6b6b" }}>{erro}</div>}
          {usuario ? (
            <form onSubmit={(e) => void enviar(e)}>
              <div className="fld">
                <label htmlFor="nota">Nota</label>
                <select id="nota" name="nota" value={nota} onChange={(e) => setNota(e.target.value)} style={{ ...campoEstilo, padding: 11 }}>
                  <option value="5">★★★★★ — Excelente</option>
                  <option value="4">★★★★☆ — Muito bom</option>
                  <option value="3">★★★☆☆ — Bom</option>
                  <option value="2">★★☆☆☆ — Regular</option>
                  <option value="1">★☆☆☆☆ — Ruim</option>
                </select>
              </div>
              <div className="fld">
                <label htmlFor="comentario">Comentário (opcional)</label>
                <textarea id="comentario" name="comentario" rows={4} maxLength={600} value={comentario} onChange={(e) => setComentario(e.target.value)} style={{ ...campoEstilo, padding: 12 }}></textarea>
              </div>
              <button type="submit" className="btn btn-grad btn-block">Enviar avaliação</button>
            </form>
          ) : (
            <p style={{ color: "var(--mute)" }}>Para avaliar, <Link to="/login" style={{ color: "var(--violet)" }}>entre na sua conta</Link> ou <Link to="/cadastro" style={{ color: "var(--violet)" }}>cadastre-se</Link>.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function PaginaProduto() {
  const { id } = useParams();
  const { produtoPorId, categorias, carregado } = useCatalogo();
  const produto = produtoPorId(Number(id));
  const adicionarComAviso = useAdicionarAoCarrinho();
  const { adicionar } = useCarrinho();
  const navigate = useNavigate();
  const [quantidade, setQuantidade] = useState(1);
  useTitulo(produto?.nome);
  useEffect(() => { setQuantidade(1); }, [id]);

  if (!carregado) return null;
  if (!produto) return <Navigate to="/produtos" replace />;
  const categoria = categorias[produto.categoria]?.nome ?? produto.categoria;
  const galeria = produto.galeria.slice(0, 5); // só fotos do próprio produto (originais em alta resolução)

  return (
    <>
      <div className="pdp-crumbs">
        <Link to="/">Início</Link> / <Link to={`/produtos?categoria=${produto.categoria}`}>{categoria}</Link> / {produto.nome}
      </div>

      <div className="product-detail-shell">
        <GaleriaProduto key={produto.id} nome={produto.nome} emoji={produto.emoji} imagens={galeria} miniaturas={produto.miniaturas.slice(0, 5)} />

        <section className="product-buy-panel">
          <div className="product-tags"><span>{categoria}</span><span>{produto.formatos[0]}</span></div>
          <h1>{produto.nome}</h1>
          {produto.num_avaliacoes > 0 && (
            <div className="product-rating"><span>{estrelasTexto(produto.avaliacao)}</span> {produto.avaliacao} ({produto.num_avaliacoes} avaliações)</div>
          )}
          <p className="product-price">{formatarPreco(produto.preco)}</p>
          <p className="product-description">{produto.descricao}</p>

          <p className="product-option-label">Formatos e detalhes:</p>
          <div className="product-format-list">
            {produto.formatos.map((f) => <span key={f}>{f}</span>)}
            <span>{produto.tamanho}</span>
          </div>

          <form className="product-buy-form" onSubmit={(e) => { e.preventDefault(); adicionarComAviso(produto.id, quantidade); }}>
            <span className="qty-box">
              <button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantidade((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantidade}</span>
              <button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantidade((q) => Math.min(20, q + 1))}>+</button>
            </span>
            <button type="submit" className="btn btn-grad">🛒 Adicionar ao carrinho</button>
          </form>
          <form className="product-buy-now-form" onSubmit={(e) => { e.preventDefault(); adicionar(produto.id, quantidade); navigate("/checkout"); }}>
            <button type="submit" className="btn btn-outline btn-block">Comprar agora</button>
          </form>
          <BotaoFavorito produto={produto} className="product-favorite" rotulo />
        </section>

        <aside className="product-benefits">
          <div><strong>▣</strong><span><b>Envio rápido</b><small>em até 5 dias, para todo o Brasil</small></span></div>
          <div><strong>♡</strong><span><b>Compra segura</b><small>Seus dados protegidos</small></span></div>
          <div><strong>✓</strong><span><b>Diversas formas de pagamento</b><small>Pix, cartão e boleto</small></span></div>
          <details open>
            <summary>Descrição completa</summary>
            <ul>
              <li>Material e acabamento de qualidade</li>
              <li>Categoria: {categoria}</li>
              <li>Produto conferido antes do envio</li>
            </ul>
          </details>
        </aside>
      </div>

      <Avaliacoes produtoId={produto.id} />
    </>
  );
}
