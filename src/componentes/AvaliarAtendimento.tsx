import { useState, type FormEvent } from "react";
import { api, mensagemDeErro } from "../api";
import { Icone } from "./Icone";

const ROTULOS: [number, string][] = [[5, "Excelente"], [4, "Muito bom"], [3, "Bom"], [2, "Regular"], [1, "Ruim"]];
const FRASES: Record<number, string> = {
  1: "Ruim. Sentimos muito, conte o que aconteceu.",
  2: "Regular. Vamos trabalhar para melhorar.",
  3: "Bom. Obrigado!",
  4: "Muito bom! Que bom que você gostou.",
  5: "Excelente! Adoramos atender você.",
};

/** Pergunta de avaliação do atendimento, mostrada na tela de pedido concluído. */
export function AvaliarAtendimento({ pedidoId }: { pedidoId: number }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState(0);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nota) return setErro("Toque em uma estrela para avaliar.");
    setEnviando(true);
    try {
      await api(`/pedidos/${pedidoId}/avaliar-atendimento`, { corpo: { nota, comentario } });
      setEnviada(nota);
    } catch (err) {
      setErro(mensagemDeErro(err));
      setEnviando(false);
    }
  };

  if (enviada) {
    return (
      <section className="aval-atend" aria-labelledby="aval-titulo">
        <div className="aval-obrigado">
          <div className="aval-estrelas" aria-hidden="true">{"★".repeat(enviada) + "☆".repeat(5 - enviada)}</div>
          <h2>Obrigado pela sua avaliação!</h2>
          <p className="aval-sub">A sua opinião ajuda a Y3D a atender cada vez melhor.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="aval-atend" data-aval-caixa aria-labelledby="aval-titulo">
      <h2 id="aval-titulo">O nosso atendimento foi bom?</h2>
      <p className="aval-sub">Conte como foi a sua experiência: toque nas estrelas para avaliar.</p>
      <form onSubmit={(e) => void enviar(e)} noValidate>
        <fieldset className="estrelas-input">
          <legend className="sr-only">Nota do atendimento, de 1 a 5 estrelas</legend>
          {ROTULOS.map(([valor, rotulo]) => (
            <span key={valor} style={{ display: "contents" }}>
              <input type="radio" name="nota" id={`atend-${valor}`} value={valor} checked={nota === valor} onChange={() => { setNota(valor); setErro(""); }} />
              <label htmlFor={`atend-${valor}`} title={rotulo}>
                <Icone nome="estrela" />
                <span className="sr-only">{valor} estrela(s): {rotulo}</span>
              </label>
            </span>
          ))}
        </fieldset>
        <p className="aval-frase" aria-live="polite">{nota ? FRASES[nota] : "Nenhuma estrela marcada ainda"}</p>
        <textarea name="comentario" rows={3} maxLength={600} placeholder="Quer contar mais? (opcional)" aria-label="Comentário sobre o atendimento" value={comentario} onChange={(e) => setComentario(e.target.value)} />
        <p className="aval-erro" role="alert" hidden={erro === ""}>{erro}</p>
        <button type="submit" className="btn btn-grad" disabled={enviando}>Enviar avaliação</button>
      </form>
    </section>
  );
}
