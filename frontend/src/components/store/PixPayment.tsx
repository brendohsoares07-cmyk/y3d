import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/format";
import { gerarQr, montarPix, qrParaSvg } from "../../utils/pix";

type Props = { pedidoId: number; valor: number };

/** Tela de pagamento via Pix: QR Code com o valor do pedido + código "copia e cola". */
export function PixPayment({ pedidoId, valor }: Props) {
  const [copiado, setCopiado] = useState(false);
  const codigo = useMemo(() => montarPix(valor), [valor]);
  const svg = useMemo(() => qrParaSvg(gerarQr(codigo)), [codigo]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* navegador bloqueou a área de transferência: a pessoa ainda pode selecionar o texto abaixo */
    }
  };

  return (
    <section className="panel pix-pay">
      <h1>Pedido #{pedidoId} recebido! Falta só o Pix</h1>
      <p className="muted">
        Abra o app do seu banco, escolha <strong>Pix → Ler QR Code</strong> e confirme o pagamento de{" "}
        <strong className="pix-valor">{formatMoney(valor)}</strong>.
      </p>
      <div className="pix-qr" dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="muted">Ou use o Pix copia e cola:</p>
      <textarea className="pix-codigo" readOnly rows={4} value={codigo} aria-label="Código Pix copia e cola" onFocus={(e) => e.currentTarget.select()} />
      <button type="button" className="btn btn-outline" onClick={copiar}>{copiado ? "Código copiado!" : "Copiar código Pix"}</button>
      <small className="muted">O valor já vem preenchido, não precisa digitar nada. Guarde o comprovante do pagamento.</small>
      <Link to="/loja/conta" className="btn btn-primary">Ver meus pedidos</Link>
    </section>
  );
}
