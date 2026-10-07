import { Link } from "react-router-dom";
import { ProductCard } from "../../components/store/ProductCard";
import { useFavorites } from "../../context/FavoritesContext";
import { useOptions } from "../../hooks/useOptions";
import { categoriasApi, produtosApi } from "../../services/resources";

export function FavoritesPage() {
  const { ids } = useFavorites();
  const produtos = useOptions(produtosApi);
  const categorias = useOptions(categoriasApi);
  const favoritos = produtos.filter((p) => ids.includes(p.id));

  return (
    <>
      <h2>Favoritos</h2>
      {favoritos.length === 0 ? (
        <p className="muted">Você ainda não favoritou nenhum produto. <Link to="/loja/produtos">Ver produtos</Link></p>
      ) : (
        <div className="product-grid small">
          {favoritos.map((p) => (
            <ProductCard key={p.id} produto={p} categoria={categorias.find((c) => c.id === p.categoriaId)?.nome} />
          ))}
        </div>
      )}
    </>
  );
}
