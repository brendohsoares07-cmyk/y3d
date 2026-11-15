import { Link } from "react-router-dom";
import { srcImagem } from "../componentes/CartaoProduto";
import { useAvisos } from "../contextos/Avisos";
import { useCarrinho } from "../contextos/Carrinho";
import { useTitulo } from "../estilos";
import { formatarPreco } from "../formatar";

export function PaginaCarrinho() {
  useTitulo("Carrinho");
  const { itens, totalItens, subtotal, atualizar, remover, limpar } = useCarrinho();
  const { avisar } = useAvisos();

  return (
    <>
      <div className="sec-h"><h2 style={{ fontSize: 20 }}>🛒 Meu Carrinho ({totalItens})</h2></div>

      {itens.length === 0 ? (
        <div className="card-panel" style={{ textAlign: "center", color: "var(--mute)", padding: "50px 20px" }}>
          <p style={{ fontSize: 40, marginBottom: 10 }}>🛒</p>
          <p>Seu carrinho está vazio.</p>
          <Link to="/produtos" className="btn btn-grad" style={{ marginTop: 14 }}>Ver produtos</Link>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          <div className="card-panel cart-panel cart-list">
            {itens.map(({ produto: p, quantidade, subtotal: linha }) => (
              <div className="item" key={p.id}>
                <Link className="ic" to={`/produto/${p.id}`} style={{ background: `linear-gradient(135deg,${p.cor1}33,${p.cor2}33)` }}>
                  {p.imagemPrincipal ? <img src={srcImagem(p.imagemPrincipal)} alt={p.nome} /> : p.emoji}
                </Link>
                <div className="info">
                  <b>{p.nome}</b>
                  <div style={{ color: "var(--mute)" }}>{formatarPreco(p.preco)} cada</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <span className="qty">
                      <button type="button" onClick={() => atualizar(p.id, quantidade - 1)}>−</button>
                      <span>{quantidade}</span>
                      <button type="button" onClick={() => atualizar(p.id, quantidade + 1)}>+</button>
                    </span>
                    <b>{formatarPreco(linha)}</b>
                  </div>
                </div>
                <button type="button" className="rm" aria-label={`Remover ${p.nome}`} onClick={() => { remover(p.id); avisar("Produto removido do carrinho."); }}>✕</button>
              </div>
            ))}
          </div>

          <div className="card-panel cart-panel">
            <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Resumo do pedido</h3>
            <div className="sum-row"><span>Subtotal</span><span>{formatarPreco(subtotal)}</span></div>
            <div className="sum-row total"><span>Total</span><span>{formatarPreco(subtotal)}</span></div>
            <Link to="/checkout" className="btn btn-grad btn-block" style={{ marginTop: 16 }}>Finalizar compra →</Link>
            <button type="button" className="btn btn-outline btn-block" style={{ marginTop: 8 }} onClick={limpar}>Esvaziar carrinho</button>
          </div>
        </div>
      )}
    </>
  );
}
