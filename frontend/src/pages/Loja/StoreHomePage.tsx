import { Link } from "react-router-dom";
import { ProductCard } from "../../components/store/ProductCard";
import { useOptions } from "../../hooks/useOptions";
import { catalogoApi } from "../../services/resources";

export function StoreHomePage() {
  const produtos = useOptions(catalogoApi.produtos);
  const categorias = useOptions(catalogoApi.categorias);
  const destaques = [...produtos].sort((a, b) => b.totalAvaliacoes - a.totalAvaliacoes).slice(0, 8);
  const bt21 = produtos.filter((p) => p.nome.toUpperCase().includes("BT21") && p.id !== 25);
  const comboBt21 = produtos.find((p) => p.id === 25);
  const comboPersonagens = produtos.find((p) => p.id === 30);
  const personagens = [6, 29, 7, 8].map((id) => produtos.find((p) => p.id === id)).filter((p) => p !== undefined);

  return (
    <>
      <section className="legacy-hero">
        <video className="legacy-hero-video" autoPlay muted loop playsInline poster="/assets/img/login/login-art.jpg"><source src="/assets/video/producao.mp4" type="video/mp4" /></video>
        <div className="legacy-hero-overlay" />
        <div className="legacy-hero-copy">
          <h1>Peças 3D que dão vida às <span className="grad">suas ideias</span></h1>
          <p className="lead">Modelos, miniaturas e peças personalizadas impressas em 3D, feitas sob encomenda.</p>
          <Link to="/loja/produtos" className="btn btn-primary">Ver produtos</Link>
          <div className="legacy-hero-tags"><span>🖨️ Impressão 3D</span><span>🎨 Peças personalizadas</span><span>📦 Envio para todo o Brasil</span></div>
        </div>
      </section>

      <section className="legacy-promo-grid">
        <article className="legacy-promo"><div><small>COLEÇÃO ESPECIAL</small><h2>Personagens que ganham vida</h2><p>Miniaturas e peças colecionáveis produzidas com impressão 3D.</p><Link to="/loja/produtos?categoria=1">Ver coleção</Link></div><img src="/assets/img/produtos/estatua-guerreira.jpg" alt="Peça de personagem impressa em 3D" /></article>
        <article className="legacy-promo legacy-promo-bt"><div><small>COLEÇÃO BT21</small><h2>Seu personagem favorito</h2><p>Peças colecionáveis e presentes personalizados.</p><Link to="/loja/produtos?q=BT21">Ver coleção</Link></div><img src="/assets/img/bt21/colecao-completa.jpg" alt="Coleção BT21" /></article>
      </section>

      {bt21.length > 0 && <section className="legacy-collection"><header><span>BT21</span><div><h2>Coleção BT21 em promoção</h2><p>Escolha seu personagem favorito</p></div></header><div className="legacy-collection-grid">{bt21.map((p) => <ProductCard key={p.id} produto={p} categoria="BT21" />)}</div>{comboBt21 && <div className="legacy-combo"><img src={comboBt21.imagens[0]} alt={comboBt21.nome}/><div><small>COLEÇÃO COMPLETA</small><h3>{comboBt21.nome}</h3><strong>{comboBt21.preco.toLocaleString("pt-BR", {style:"currency",currency:"BRL"})}</strong></div><Link className="btn btn-primary" to={`/loja/produtos/${comboBt21.id}`}>Ver coleção</Link></div>}</section>}
      {comboPersonagens && personagens.length === 4 && <section className="legacy-characters"><span>OFERTA IMPERDÍVEL</span><h2>4 personagens. Um combo de respeito.</h2><p>Estátua Guerreira, Bowser, Grinch e Bailarina Rosa: leve os quatro e economize.</p><div className="legacy-collection-grid">{personagens.map((p) => <ProductCard key={p.id} produto={p} />)}</div><div className="legacy-combo"><div><small>COMBO ESPECIAL</small><h3>{comboPersonagens.nome}</h3><strong>{comboPersonagens.preco.toLocaleString("pt-BR", {style:"currency",currency:"BRL"})}</strong></div><Link className="btn btn-primary" to={`/loja/produtos/${comboPersonagens.id}`}>Garantir meu combo</Link></div></section>}

      <h2 className="section-title">Categorias</h2>
      <div className="chips">
        {categorias.map((c) => (
          <Link key={c.id} to={`/loja/produtos?categoria=${c.id}`} className="chip">{c.nome}</Link>
        ))}
      </div>

      <h2 className="section-title">Mais avaliados</h2>
      <div className="product-grid">
        {destaques.map((p) => (
          <ProductCard key={p.id} produto={p} categoria={categorias.find((c) => c.id === p.categoriaId)?.nome} />
        ))}
      </div>
    </>
  );
}
