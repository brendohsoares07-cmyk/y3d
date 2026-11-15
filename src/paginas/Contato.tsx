import { useState, type FormEvent } from "react";
import { api, ErroApi } from "../api";
import { Icone } from "../componentes/Icone";
import { useTitulo } from "../estilos";
import { WHATSAPP_URL } from "../formatar";

const campoTexto = { width: "100%", borderRadius: 10, border: "1px solid var(--line)", background: "var(--raise)", color: "var(--text)", padding: 12 } as const;
const erroEstilo = { color: "#ff6b6b" } as const;

export function PaginaContato() {
  useTitulo("Contato");
  const [valores, setValores] = useState({ nome: "", email: "", mensagem: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEnviado(false);
    setEnviando(true);
    try {
      await api("/mensagens", { corpo: valores });
      setErros({});
      setEnviado(true);
      setValores({ nome: "", email: "", mensagem: "" });
    } catch (err) {
      const recebidos = err instanceof ErroApi ? (err.dados.erros as Record<string, string> | undefined) : undefined;
      setErros(recebidos ?? { mensagem: err instanceof Error ? err.message : "Não foi possível enviar agora." });
    } finally {
      setEnviando(false);
    }
  };
  const mudar = (campo: keyof typeof valores) => (e: { target: { value: string } }) => setValores((v) => ({ ...v, [campo]: e.target.value }));

  return (
    <div className="grid g2" style={{ alignItems: "start" }}>
      <div>
        <h1 style={{ fontSize: "clamp(22px,3vw,30px)", margin: "0 0 12px" }}>Fale com a Y3D</h1>
        <p style={{ color: "var(--mute)", maxWidth: "44ch" }}>Dúvidas sobre um pedido, orçamento para um modelo personalizado ou impressão 3D? Envie sua mensagem.</p>
        <ul style={{ marginTop: 22, display: "grid", gap: 10, color: "var(--mute)", fontSize: 14 }}>
          <li>✉️ <a href="mailto:y3dsuporte@gmail.com">y3dsuporte@gmail.com</a></li>
          <li>📞 +55 44 9963-8985</li>
        </ul>
        <a className="btn-whats" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Y3D no WhatsApp">
          <Icone nome="whatsapp" />
          Chamar no WhatsApp
        </a>
      </div>

      <div className="card-panel">
        {enviado && <div className="alert">Mensagem enviada! Obrigado pelo contato.</div>}
        <form onSubmit={(e) => void enviar(e)} noValidate>
          <div className="fld">
            <label htmlFor="nome">Nome</label>
            <input id="nome" name="nome" value={valores.nome} onChange={mudar("nome")} />
            {erros.nome && <small style={erroEstilo}>{erros.nome}</small>}
          </div>
          <div className="fld">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" value={valores.email} onChange={mudar("email")} />
            {erros.email && <small style={erroEstilo}>{erros.email}</small>}
          </div>
          <div className="fld">
            <label htmlFor="mensagem">Mensagem</label>
            <textarea id="mensagem" name="mensagem" rows={5} style={campoTexto} value={valores.mensagem} onChange={mudar("mensagem")}></textarea>
            {erros.mensagem && <small style={erroEstilo}>{erros.mensagem}</small>}
          </div>
          <button type="submit" className="btn btn-grad btn-block" disabled={enviando}>Enviar mensagem</button>
        </form>
      </div>
    </div>
  );
}
