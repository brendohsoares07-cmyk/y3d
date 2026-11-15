import { useState } from "react";
import { Link } from "react-router-dom";
import { FormLogin, ArteLogin } from "../componentes/FormulariosConta";
import { PromoBt21, PromoPersonagens, SobreHome } from "../componentes/SecoesHome";
import { useSessao } from "../contextos/Sessao";
import { useTitulo } from "../estilos";
import { WHATSAPP_URL } from "../formatar";

const SLIDES = ["suporte-controle-guerreiro", "porta-lata-monster", "estatua-guerreira", "bowser", "quadro-flamengo-paqueta"];

export function PaginaInicio() {
  useTitulo("Início");
  const { usuario } = useSessao();
  const [semVideo, setSemVideo] = useState(false);

  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-media">
          {!semVideo ? (
            <video autoPlay muted loop playsInline poster="/assets/img/produtos/porta-lata-monster.jpg">
              <source src="/assets/video/producao.mp4" type="video/mp4" onError={() => setSemVideo(true)} />
            </video>
          ) : (
            SLIDES.map((s) => <div key={s} className="hero-slide" style={{ backgroundImage: `url('/assets/img/produtos/${s}.jpg')` }}></div>)
          )}
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-copy">
          <h1>Transforme suas ideias em <span className="grad">REALIDADE 3D</span></h1>
          <p>Modelos 3D de alta qualidade, prontos para seus projetos, impressões e animações.</p>
          <div className="hero-cta">
            <Link to="/produtos" className="btn btn-grad">Explorar loja →</Link>
            <a href="#promo-bt21" className="btn btn-outline" onClick={(e) => { e.preventDefault(); document.getElementById("promo-bt21")?.scrollIntoView({ behavior: "smooth" }); }}>Ver Coleção BT21</a>
          </div>
          <ul className="hero-tags">
            <li><span className="tag-ic">✨</span><span>Peças Premium<br /><b>Alta qualidade</b></span></li>
            <li><span className="tag-ic">🚚</span><span>Envio para todo o Brasil<br /><b>Frete seguro</b></span></li>
            <li><span className="tag-ic">🛟</span><span>Suporte especializado<br /><b>Sempre com você</b></span></li>
          </ul>
        </div>
      </section>

      <section className="sec" aria-label="Vantagens da loja">
        <ul className="trust">
          <li><span className="trust-ic">💳</span><span><b>Pix, cartão e boleto</b>Pague do seu jeito</span></li>
          <li><span className="trust-ic">📦</span><span><b>Enviamos para todo o Brasil</b>Frete seguro e rastreio</span></li>
          <li><span className="trust-ic">🔒</span><span><b>Compra 100% segura</b>Seus dados protegidos</span></li>
          <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><span className="trust-ic">💬</span><span><b>Atendimento no WhatsApp</b>Tire dúvidas antes de comprar</span></a></li>
        </ul>
      </section>

      <SobreHome />
      <PromoBt21 />
      <PromoPersonagens />

      {!usuario && (
        <section className="sec">
          <div className="sec-h sec-h-centro"><h2>Acesse sua conta</h2></div>
          <div className="lg-embed">
            <div className="lg-art"><ArteLogin /></div>
            <div className="lg-side"><div className="lg-card"><FormLogin prefixo="home" /></div></div>
          </div>
        </section>
      )}
    </>
  );
}
