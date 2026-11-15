import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

const moeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function CartPage() {
  const { itens, subtotal, alterarQuantidade, remover } = useCart();
  if (!itens.length) return <section className="panel empty-cart"><h1>Seu carrinho está vazio</h1><p className="muted">Escolha seus produtos favoritos e volte para finalizar a compra.</p><Link className="btn btn-primary" to="/loja/produtos">Ver produtos</Link></section>;
  return <section className="panel">
    <h1>Meu carrinho ({itens.reduce((n, item) => n + item.quantidade, 0)})</h1>
    <div className="cart-page-list">
      {itens.map((item) => <article className="cart-page-item" key={`${item.produtoId}-${item.personalizacao ?? ""}`}>
        <Link to={`/loja/produtos/${item.produtoId}`} className="cart-page-image">{item.imagem ? <img src={item.imagem.startsWith("/") ? item.imagem : `/assets/${item.imagem}`} alt={item.nome}/> : <span>{item.emoji ?? "📦"}</span>}</Link>
        <div className="cart-page-info"><Link to={`/loja/produtos/${item.produtoId}`}><strong>{item.nome}</strong></Link>{item.personalizacao && <small>Personalização: {item.personalizacao}</small>}<span>{moeda(item.preco)} cada</span>
          <div className="cart-page-quantity"><button type="button" onClick={() => alterarQuantidade(item, item.quantidade - 1)} aria-label="Diminuir quantidade">−</button><b>{item.quantidade}</b><button type="button" onClick={() => alterarQuantidade(item, item.quantidade + 1)} aria-label="Aumentar quantidade">+</button><button className="cart-remove" type="button" onClick={() => remover(item)}>Remover</button></div>
        </div><strong>{moeda(item.preco * item.quantidade)}</strong>
      </article>)}
    </div>
    <div className="cart-page-total"><span>Subtotal</span><strong>{moeda(subtotal)}</strong></div>
    <p className="muted">Frete e opções de pagamento são calculados na finalização.</p>
    <div className="cart-page-actions"><Link className="btn btn-outline" to="/loja/produtos">Continuar comprando</Link><Link className="btn btn-primary" to="/loja/checkout">Finalizar compra</Link></div>
  </section>;
}
