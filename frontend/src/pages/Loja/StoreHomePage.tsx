import { Link } from "react-router-dom";
import { ProductCard } from "../../components/store/ProductCard";
import { useOptions } from "../../hooks/useOptions";
import { categoriasApi, produtosApi } from "../../services/resources";

export function StoreHomePage() {
  const produtos = useOptions(produtosApi);
  const categorias = useOptions(categoriasApi);
  const destaques = [...produtos].sort((a, b) => b.totalAvaliacoes - a.totalAvaliacoes).slice(0, 8);

  return (
    <>
      <section className="hero panel">
        <div>
          <h1>Peças 3D que dão vida às <span className="grad">suas ideias</span></h1>
          <p className="lead">Modelos, miniaturas e peças personalizadas impressas em 3D, feitas sob encomenda.</p>
          <Link to="/loja/produtos" className="btn btn-primary">Ver produtos</Link>
        </div>
      </section>

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
