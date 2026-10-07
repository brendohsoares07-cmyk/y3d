import { WhatsAppIcon } from "../../components/store/Icons";

const WHATSAPP_NUMERO = "554499638985"; // +55 44 9963-8985
const WHATSAPP_TEXTO = "Olá! Vim pelo site da Y3D Creations e gostaria de mais informações.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_TEXTO)}`;

export function ContactPage() {
  return (
    <div className="panel prose">
      <h1>Fale com a Y3D</h1>
      <p className="lead">
        Dúvidas sobre um pedido, orçamento para um modelo personalizado ou impressão 3D? Fale com a gente.
      </p>
      <p>✉️ <a href="mailto:suporte@y3dcreations.com">suporte@y3dcreations.com</a></p>
      <p>📞 +55 44 9963-8985</p>
      <a className="whatsapp-btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
        aria-label="Conversar com a Y3D no WhatsApp">
        <WhatsAppIcon size={16} />
        Chamar no WhatsApp
      </a>
    </div>
  );
}
