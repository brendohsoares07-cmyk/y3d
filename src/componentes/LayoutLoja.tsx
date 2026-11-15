import { useEffect, type FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fotoUrl, iniciais, INSTAGRAM_URL, WHATSAPP_URL, YOUTUBE_URL } from "../formatar";
import { useFolhaDeEstilo } from "../estilos";
import { AvisoFlash, Toast } from "../contextos/Avisos";
import { useCarrinho } from "../contextos/Carrinho";
import { useFavoritos } from "../contextos/Favoritos";
import { useSessao } from "../contextos/Sessao";
import { Icone } from "./Icone";

const LOGO = "/assets/img/logo-y3d-transparente.png";

function Cabecalho() {
  const { usuario } = useSessao();
  const { totalItens } = useCarrinho();
  const { ids } = useFavoritos();
  const navigate = useNavigate();
  const [busca] = useSearchParams();
  const link = ({ isActive }: { isActive: boolean }) => (isActive ? "on" : "");

  const buscar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const termo = String(new FormData(e.currentTarget).get("busca") ?? "").trim();
    navigate(termo ? `/produtos?busca=${encodeURIComponent(termo)}` : "/produtos");
  };

  return (
    <header className="hdr">
      <div className="hdr-in">
        <Link to="/" className="logo"><img src={LOGO} className="logo-ic" alt="Y3D Creations" /></Link>
        <nav className="hdr-nav">
          <NavLink to="/" end className={link}>Início</NavLink>
          <NavLink to="/produtos" className={link}>Produtos</NavLink>
          <NavLink to="/contato" className={link}>Contato</NavLink>
        </nav>
        <form className="hdr-search" onSubmit={buscar}>
          <span>🔍</span>
          <input type="search" name="busca" key={busca.get("busca") ?? ""} aria-label="Buscar produtos" placeholder="Buscar produtos, modelos ou categorias..." defaultValue={busca.get("busca") ?? ""} />
        </form>
        <div className="hdr-icons">
          <Link to={usuario ? "/conta" : "/login"} className="ibtn" title="Minha conta" aria-label="Minha conta">👤</Link>
          <Link to="/favoritos" className="ibtn" id="btn-favoritos" title="Favoritos" aria-label="Favoritos">
            ♡{ids.length > 0 && <span className="n" id="fav-count">{ids.length}</span>}
          </Link>
          <Link to="/carrinho" className="ibtn" title="Carrinho" aria-label="Carrinho">
            🛒{totalItens > 0 && <span className="n">{totalItens}</span>}
          </Link>
          {usuario?.admin && <Link to="/admin" className="btn btn-outline btn-sm">Admin</Link>}
          {usuario ? (
            <Link to="/conta" className="ava" title={usuario.nome}>
              {usuario.foto ? <img src={fotoUrl(usuario.foto)} alt="" referrerPolicy="no-referrer" /> : iniciais(usuario.nome)}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-grad btn-sm" style={{ marginLeft: 6 }}>Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}

function Rodape() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-main">
          <div className="ftr-brand">
            <Link to="/" className="ftr-logo" aria-label="Y3D Creations — página inicial"><img src={LOGO} alt="Y3D Creations" loading="lazy" /></Link>
            <p>Transformando ideias em realidade com tecnologia, inovação e qualidade. Sua loja de produtos e soluções em impressão 3D.</p>
          </div>

          <nav className="ftr-col" aria-label="Navegação">
            <h4>Navegação</h4>
            <ul className="ftr-nav">
              <li><Link to="/"><i><Icone nome="casa" /></i>Início</Link></li>
              <li><Link to="/produtos"><i><Icone nome="carrinho" /></i>Produtos</Link></li>
              <li><Link to="/contato"><i><Icone nome="conversa" /></i>Contato</Link></li>
            </ul>
          </nav>

          <div className="ftr-col">
            <h4>Redes Sociais</h4>
            <p className="ftr-sub">Siga a Y3D e fale com a gente.</p>
            <div className="ftr-social">
              <a href={INSTAGRAM_URL} title="Instagram" aria-label="Instagram da Y3D Creations" target="_blank" rel="noopener noreferrer"><Icone nome="instagram" /></a>
              <a href={YOUTUBE_URL} title="YouTube" aria-label="YouTube da Y3D Creations" target="_blank" rel="noopener noreferrer"><Icone nome="youtube" /></a>
              <a href={WHATSAPP_URL} title="WhatsApp" aria-label="Conversar com a Y3D no WhatsApp" target="_blank" rel="noopener noreferrer"><Icone nome="whatsapp" /></a>
            </div>
          </div>

          <div className="ftr-col">
            <h4>Formas de Pagamento</h4>
            <p className="ftr-sub">Compre com total segurança.</p>
            <div className="ftr-pay">
              <span className="pay-visa">VISA</span>
              <Icone nome="mastercard" className="pay-mc" />
              <span className="pay-elo"><b>e</b>lo</span>
              <span className="pay-pix"><Icone nome="pix" />pix</span>
            </div>
            <div className="ftr-boleto"><Icone nome="boleto" /><span>Boleto bancário</span></div>
          </div>

          <div className="ftr-col">
            <h4>Entrega</h4>
            <p className="ftr-sub">Enviamos para todo o Brasil.</p>
            <ul className="ftr-feat">
              <li><i><Icone nome="caminhao" /></i><span><b>Frete seguro</b>para todo o país</span></li>
              <li><i><Icone nome="raio" /></i><span><b>Entrega expressa</b>(consulte regiões)</span></li>
              <li><i><Icone nome="pino" /></i><span><b>Rastreie seu pedido</b>em tempo real</span></li>
            </ul>
          </div>

          <div className="ftr-col">
            <h4>Compra Segura</h4>
            <p className="ftr-sub">Seus dados protegidos.</p>
            <ul className="ftr-feat">
              <li><i><Icone nome="escudo" /></i><span><b>Ambiente 100% seguro</b>com criptografia SSL</span></li>
              <li><i><Icone nome="cadeado" /></i><span><b>Privacidade garantida</b>em todas as etapas</span></li>
            </ul>
          </div>
        </div>

        <div className="ftr-bottom">
          <span>© 2026 Y3D — Projeto acadêmico. Todos os direitos reservados.</span>
          <div className="ftr-end">
            <span>Impressão 3D é <b>o futuro.</b></span>
            <span className="ftr-line"></span>
            <img src={LOGO} alt="Y3D Creations" loading="lazy" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Estrutura das páginas da loja: cabeçalho, conteúdo (com o aviso de sessão no topo) e rodapé. */
export function LayoutLoja() {
  const pronto = useFolhaDeEstilo("/assets/css/style.css");
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  if (!pronto) return null;
  return (
    <>
      <Cabecalho />
      <main className="wrap" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <AvisoFlash />
        <Outlet />
      </main>
      <Rodape />
      <Toast />
    </>
  );
}

/** Páginas de entrada (login e cadastro): sem cabeçalho nem rodapé, só o CSS da loja. */
export function LayoutAutenticacao() {
  const pronto = useFolhaDeEstilo("/assets/css/style.css");
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  if (!pronto) return null;
  return (
    <>
      <Outlet />
      <Toast />
    </>
  );
}

/** Painel admin: usa só o admin.css, igual ao admin.php. */
export function LayoutAdmin() {
  const pronto = useFolhaDeEstilo("/assets/css/admin.css");
  // o admin.css espera a barra lateral e o conteúdo como filhos diretos do body (body { display: flex });
  // no React eles ficam dentro de #root, então o #root assume esse papel enquanto o painel está aberto
  useEffect(() => {
    const raiz = document.getElementById("root");
    if (!raiz) return;
    raiz.style.cssText = "display:flex;flex:1;min-width:0;";
    return () => { raiz.style.cssText = ""; };
  }, []);
  if (!pronto) return null;
  return <Outlet />;
}
