import { FormEvent, useState } from "react";
import { WhatsAppIcon } from "../../components/store/Icons";
import { Alert } from "../../components/ui/Alert";
import { request } from "../../services/apiClient";

const WHATSAPP_NUMERO = "554499638985";
const WHATSAPP_TEXTO = "Olá! Vim pelo site da Y3D Creations e gostaria de mais informações.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_TEXTO)}`;

export function ContactPage() {
  const [nome, setNome] = useState(""); const [email, setEmail] = useState(""); const [mensagem, setMensagem] = useState(""); const [erro, setErro] = useState(""); const [sucesso, setSucesso] = useState(false); const [enviando, setEnviando] = useState(false);
  const enviar = async (event: FormEvent) => { event.preventDefault(); setErro(""); setSucesso(false); if (nome.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email) || mensagem.trim().length < 5) { setErro("Preencha nome, e-mail válido e uma mensagem com pelo menos 5 caracteres."); return; } setEnviando(true); try { await request("/contact/messages", { method: "POST", body: { nome, email, mensagem } }); setSucesso(true); setNome(""); setEmail(""); setMensagem(""); } catch (e) { setErro(e instanceof Error ? e.message : "Não foi possível enviar sua mensagem."); } finally { setEnviando(false); } };
  return <div className="contact-grid"><section className="panel prose"><h1>Fale com a Y3D</h1><p className="lead">Dúvidas sobre um pedido, orçamento para um modelo personalizado ou impressão 3D? Fale com a gente.</p><p>✉️ <a href="mailto:y3dsuporte@gmail.com">y3dsuporte@gmail.com</a></p><p>📞 +55 44 9963-8985</p><a className="whatsapp-btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16}/> Chamar no WhatsApp</a></section><section className="panel"><h2>Envie uma mensagem</h2>{erro && <Alert>{erro}</Alert>}{sucesso && <Alert tipo="sucesso">Mensagem enviada! Nossa equipe entrará em contato.</Alert>}<form className="form" onSubmit={enviar}><label>Nome<input required minLength={2} value={nome} onChange={e=>setNome(e.target.value)} /></label><label>E-mail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Mensagem<textarea required minLength={5} rows={5} value={mensagem} onChange={e=>setMensagem(e.target.value)} /></label><button className="btn btn-primary" disabled={enviando}>{enviando ? "Enviando..." : "Enviar mensagem"}</button></form></section></div>;
}
