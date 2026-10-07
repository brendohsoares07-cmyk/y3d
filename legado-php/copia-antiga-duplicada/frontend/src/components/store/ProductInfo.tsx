import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Categoria, Produto } from "../../types";
import { formatMoney } from "../../utils/format";
import { Button } from "../ui/Button";
import { AuthRequiredModal } from "./AuthRequiredModal";
import { HeartIcon, CartIcon } from "./Icons";
import { StarRating } from "./StarRating";

const MAX_QUANTIDADE = 99;

/** Seletor de quantidade − 1 + (exclusivo desta seção). */
function QuantityStepper({ valor, onChange }: { valor: number; onChange: (n: number) => void }) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(Math.max(1, valor - 1))} aria-label="Diminuir quantidade">−</button>
      <span aria-live="polite">{valor}</span>
      <button type="button" onClick={() => onChange(Math.min(MAX_QUANTIDADE, valor + 1))} aria-label="Aumentar quantidade">+</button>
    </div>
  );
}

/** Coluna central: categoria, nome, avaliação, preço, personalização, quantidade e botões de compra. */
export function ProductInfo({ produto, categoria }: { produto: Produto; categoria?: Categoria }) {
  const { usuario } = useAuth();
  const location = useLocation();
  const { adicionar } = useCart();
  const { ehFavorito, alternar } = useFavorites();
  const [quantidade, setQuantidade] = useState(1);
  const [personalizacao, setPersonalizacao] = useState("");
  const [adicionado, setAdicionado] = useState(false);
  const [pedirLogin, setPedirLogin] = useState(false);
  const favorito = ehFavorito(produto.id);

  const comprar = () => {
    adicionar(produto, quantidade, personalizacao || null);
    setAdicionado(true);
  };

  const favoritar = () => {
    if (!usuario) {
      setPedirLogin(true);
      return;
    }
    alternar(produto.id);
  };

  return (
    <section className="panel product-info">
      {categoria && (
        <div className="chips">
          <Link to={`/loja/produtos?categoria=${categoria.id}`} className="chip">{categoria.nome}</Link>
        </div>
      )}
      <h1>{produto.nome}</h1>
      <StarRating nota={produto.avaliacao} total={produto.totalAvaliacoes} />
      <p className="big-price">{formatMoney(produto.preco)}</p>
      {produto.descricao && <p className="lead">{produto.descricao}</p>}

      {produto.personalizacoes.length > 0 && (
        <div className="field">
          <label htmlFor="personalizacao">Personalização:</label>
          <select id="personalizacao" value={personalizacao} onChange={(e) => { setPersonalizacao(e.target.value); setAdicionado(false); }}>
            <option value="">Escolha uma opção (opcional)</option>
            {produto.personalizacoes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label>Quantidade:</label>
        <QuantityStepper valor={quantidade} onChange={(n) => { setQuantidade(n); setAdicionado(false); }} />
      </div>

      <Button className="btn-wide" onClick={comprar}><CartIcon size={18} /> Adicionar ao carrinho</Button>
      {adicionado && (
        <p className="added" role="status">
          Adicionado! <Link to="/loja/checkout">Finalizar compra →</Link>
        </p>
      )}
      <Button variant="outline" className="btn-wide" onClick={favoritar} aria-pressed={favorito}>
        <HeartIcon size={18} filled={favorito} /> {favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      </Button>
      {pedirLogin && (
        <AuthRequiredModal returnTo={`${location.pathname}${location.search}`} onClose={() => setPedirLogin(false)} />
      )}
    </section>
  );
}
