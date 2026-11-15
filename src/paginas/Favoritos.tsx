import { Link } from "react-router-dom";
import { CartaoProduto } from "../componentes/CartaoProduto";
import { useCatalogo } from "../contextos/Catalogo";
import { useFavoritos } from "../contextos/Favoritos";
import { useTitulo } from "../estilos";

export function PaginaFavoritos() {
  useTitulo("Favoritos");
  const { produtos } = useCatalogo();
  const { ids } = useFavoritos();
  const lista = produtos.filter((p) => ids.includes(p.id));
  return (
    <>
      <div className="sec-h">
        <h2>Meus favoritos</h2>
        <span className="more" id="favoritos-contagem">{lista.length} produto{lista.length === 1 ? "" : "s"}</span>
      </div>
      <div className="grid g4" id="favoritos-grid">
        {lista.map((p) => <div className="fav-wrap" key={p.id} data-produto-id={p.id}><CartaoProduto produto={p} /></div>)}
      </div>
      {lista.length === 0 && (
        <div className="card-panel" id="favoritos-vazio" style={{ textAlign: "center", color: "var(--mute)" }}>
          <p>Você ainda não tem produtos favoritos.</p>
          <p className="muted" style={{ fontSize: 13 }}>Clique no coração ♡ de um produto para guardá-lo aqui.</p>
          <Link to="/produtos" className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>Ver produtos</Link>
        </div>
      )}
    </>
  );
}
