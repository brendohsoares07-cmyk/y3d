import { Link } from "react-router-dom";
import type { Produto } from "../../shared/tipos";
import { estrelasTexto, formatarPreco } from "../formatar";
import { useAvisos } from "../contextos/Avisos";
import { useCarrinho } from "../contextos/Carrinho";
import { useFavoritos } from "../contextos/Favoritos";
import { useCatalogo } from "../contextos/Catalogo";

export function BotaoFavorito({ produto, className, rotulo }: { produto: Produto; className: string; rotulo?: boolean }) {
  const { ehFavorito, alternar } = useFavoritos();
  const { toast } = useAvisos();
  const ativo = ehFavorito(produto.id);
  const marca = ativo ? "♥" : "♡";
  return (
    <button
      type="button"
      className={className}
      data-fav={produto.id}
      aria-pressed={ativo}
      aria-label={rotulo ? undefined : `Favoritar ${produto.nome}`}
      onClick={() => toast(alternar(produto.id) ? "Adicionado aos favoritos" : "Removido dos favoritos")}
    >
      {rotulo ? `${marca} Adicionar aos favoritos` : marca}
    </button>
  );
}

export function useAdicionarAoCarrinho() {
  const { adicionar } = useCarrinho();
  const { avisar, toast } = useAvisos();
  return (id: number, quantidade = 1) => {
    adicionar(id, quantidade);
    avisar("Produto adicionado ao carrinho!");
    toast("Produto adicionado ao carrinho!");
  };
}

export function CartaoProduto({ produto: p }: { produto: Produto }) {
  const adicionar = useAdicionarAoCarrinho();
  return (
    <article className="card" data-nome={p.nome.toLowerCase()} data-categoria={p.categoria}>
      <Link to={`/produto/${p.id}`}>
        <div className="thumb" style={{ background: `linear-gradient(135deg,${p.cor1}33,${p.cor2}33)` }}>
          {p.imagemPrincipal ? <img src={srcImagem(p.imagemPrincipal)} alt={p.nome} loading="lazy" /> : p.emoji}
        </div>
      </Link>
      <BotaoFavorito produto={p} className="fav-btn" />
      <div className="card-body">
        <Link to={`/produto/${p.id}`}><h3>{p.nome}</h3></Link>
        {p.num_avaliacoes > 0 && (
          <div className="rate"><span className="st">{estrelasTexto(p.avaliacao)}</span> {p.avaliacao} ({p.num_avaliacoes})</div>
        )}
        <div className="price-row">
          <span className="price">{formatarPreco(p.preco)}</span>
          <button type="button" className="cart-add" aria-label={`Adicionar ${p.nome} ao carrinho`} onClick={() => adicionar(p.id)}>🛒</button>
        </div>
      </div>
    </article>
  );
}

/** Imagem do catálogo: caminhos locais ganham "/" na frente; URLs https ficam como estão. */
export function srcImagem(caminho: string): string {
  return /^https?:\/\//i.test(caminho) ? caminho : `/${caminho.replace(/^\/+/, "")}`;
}

export function useProdutosPorIds(ids: number[]): Produto[] {
  const { produtoPorId } = useCatalogo();
  return ids.map(produtoPorId).filter((p): p is Produto => !!p);
}
