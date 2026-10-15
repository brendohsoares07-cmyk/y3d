import { Link } from "react-router-dom";

/** Início › Produtos › Nome do produto */
export function Breadcrumb({ atual }: { atual: string }) {
  return (
    <nav className="breadcrumb" aria-label="Você está em">
      <Link to="/loja">Início</Link>
      <span>›</span>
      <Link to="/loja/produtos">Produtos</Link>
      <span>›</span>
      <span aria-current="page">{atual}</span>
    </nav>
  );
}
