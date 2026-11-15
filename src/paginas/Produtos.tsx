import { Link, useSearchParams } from "react-router-dom";
import { CartaoProduto } from "../componentes/CartaoProduto";
import { useCatalogo } from "../contextos/Catalogo";
import { useTitulo } from "../estilos";

const IMAGENS_CATEGORIA: Record<string, string> = {
  todos: "estatua-guerreira",
  personagens: "bailarina-rosa",
  objetos: "bandejas-bt21",
  animais: "dinossauros-equilibrio",
  personalizados: "chaveiros-porta-photocard",
};

const IMAGENS_COM_FUNDO_Y3D = new Set([
  "assets/img/produtos/chaveiros-nomes-bts.jpg",
  "assets/img/produtos/chaveiros-porta-photocard.jpg",
  "assets/img/produtos/bandejas-bt21.jpg",
  "assets/img/produtos/porta-oculos-ovelha.jpg",
  "assets/img/produtos/estatua-guerreira.jpg",
  "assets/img/produtos/grinch-poltrona.jpg",
  "assets/img/produtos/bailarina-rosa.jpg",
  "assets/img/produtos/dinossauros-equilibrio.jpg",
  "assets/img/produtos/garrafa-termica-jin.jpg",
  "assets/img/produtos/leque-bts.jpg",
  "assets/img/produtos/dragao-preto.jpg",
  "assets/img/produtos/quadro-flamengo-paqueta.jpg",
  "assets/img/bt21/cooky.jpg",
  "assets/img/bt21/tata.jpg",
  "assets/img/bt21/chimmy.jpg",
  "assets/img/bt21/shooky.jpg",
  "assets/img/bt21/mang.jpg",
  "assets/img/bt21/rj.jpg",
  "assets/img/bt21/colecao-home.jpg",
  "assets/img/produtos/coiote.jpg",
  "assets/img/produtos/frajola.jpg",
  "assets/img/produtos/harry-potter.jpg",
  "assets/img/produtos/bowser.jpg",
  "assets/img/produtos/combo-personagens.jpg",
  "assets/img/produtos/suporte-controle-guerreiro.jpg",
  "assets/img/produtos/porta-lata-monster.jpg",
  "assets/img/produtos/boneco-personalizado-kent.jpg",
  "assets/img/produtos/chaveiros-power-ranger.jpg",
]);

export function PaginaProdutos() {
  useTitulo("Produtos");
  const { produtos, categorias } = useCatalogo();
  const [params] = useSearchParams();
  const pedida = params.get("categoria") ?? "todos";
  const ativa = pedida !== "todos" && !(pedida in categorias) ? "todos" : pedida; // categoria que não existe (ou foi removida)
  const busca = (params.get("busca") ?? "").trim();

  let lista = produtos.filter((p) => IMAGENS_COM_FUNDO_Y3D.has(p.imagemPrincipal));
  if (ativa !== "todos") lista = lista.filter((p) => p.categoria === ativa);
  if (busca !== "") {
    const termo = busca.toLowerCase();
    lista = lista.filter((p) => p.nome.toLowerCase().includes(termo) || (categorias[p.categoria]?.nome ?? "").toLowerCase().includes(termo));
  }
  const destaque = (slug: string) => (ativa === slug ? { borderColor: "var(--violet)" } : undefined);
  const imagem = (slug: string) => `/assets/img/produtos/${IMAGENS_CATEGORIA[slug] ?? IMAGENS_CATEGORIA.todos}.jpg`;

  return (
    <div className="grid" style={{ gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>
      <aside className="card-panel">
        <h2 style={{ fontSize: 15, margin: "0 0 14px" }}>Categorias</h2>
        <ul style={{ display: "grid", gap: 4 }}>
          <li><Link className="cat-card" style={destaque("todos")} to="/produtos"><span className="cat-ic"><img src={imagem("todos")} alt="" /></span><span>Todos</span></Link></li>
          {Object.entries(categorias).map(([slug, cat]) => (
            <li key={slug}><Link className="cat-card" style={destaque(slug)} to={`/produtos?categoria=${slug}`}><span className="cat-ic"><img src={imagem(slug)} alt="" /></span><span>{cat.nome}</span></Link></li>
          ))}
        </ul>
      </aside>

      <div>
        <div className="sec-h">
          <h2>{busca !== "" ? `Resultados para "${busca}"` : ativa !== "todos" ? categorias[ativa]?.nome : "Todos os produtos"}</h2>
          <span className="more">{lista.length} produto{lista.length === 1 ? "" : "s"}</span>
        </div>
        {lista.length === 0 ? (
          <div className="card-panel" style={{ textAlign: "center", color: "var(--mute)" }}>
            <p>Nenhum produto encontrado para esse filtro.</p>
            <Link to="/produtos" className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>Limpar filtros</Link>
          </div>
        ) : (
          <div className="grid g4">{lista.map((p) => <CartaoProduto key={p.id} produto={p} />)}</div>
        )}
      </div>
    </div>
  );
}
