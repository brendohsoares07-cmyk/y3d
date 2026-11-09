import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../../components/ui/Alert";
import { getApiErrorMessage } from "../../services/apiClient";
import { pedidosApi } from "../../services/resources";
import { formatMoney } from "../../utils/format";
import { gerarQr, montarPix, qrParaSvg } from "../../utils/pix";

type Props = { pedidoId: number; valor: number };

/** Tela de pagamento via Pix: QR Code com o valor do pedido + código "copia e cola". */
export function PixPayment({ pedidoId, valor }: Props) {
  const [copiado, setCopiado] = useState(false);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [pedidoCancelado, setPedidoCancelado] = useState(false);
  const [erroVerificacao, setErroVerificacao] = useState<string | null>(null);
  const codigo = useMemo(() => montarPix(valor), [valor]);
  const svg = useMemo(() => qrParaSvg(gerarQr(codigo)), [codigo]);

  useEffect(() => {
    let ativo = true;
    let timeout: number | undefined;

    const verificarPagamento = async () => {
      try {
        const pedido = await pedidosApi.get(pedidoId);
        if (!ativo) return;

        setErroVerificacao(null);
        if (pedido.status === "PAGO" || pedido.status === "ENVIADO" || pedido.status === "ENTREGUE") {
          setPagamentoConfirmado(true);
          return;
        }
        if (pedido.status === "CANCELADO") {
          setPedidoCancelado(true);
          return;
        }
      } catch (error) {
        if (ativo) {
          setErroVerificacao(getApiErrorMessage(error, "Não foi possível verificar o pagamento agora."));
        }
      }

      if (ativo) timeout = window.setTimeout(verificarPagamento, 5000);
    };

    void verificarPagamento();
    return () => {
      ativo = false;
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, [pedidoId]);

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
      {pagamentoConfirmado ? (
        <>
          <h1>Pagamento efetuado com sucesso</h1>
          <p className="muted">O pagamento do pedido #{pedidoId} foi confirmado.</p>
          <Link to="/loja/conta" className="btn btn-primary">Ver meus pedidos</Link>
        </>
      ) : pedidoCancelado ? (
        <>
          <h1>Pedido cancelado</h1>
          <p className="muted">Este pedido foi cancelado. Entre em contato com a loja se precisar de ajuda.</p>
          <Link to="/loja/conta" className="btn btn-primary">Ver meus pedidos</Link>
        </>
      ) : (
        <>
          <h1>Pedido #{pedidoId} recebido! Falta só o Pix</h1>
          <p className="muted">
            Abra o app do seu banco, escolha <strong>Pix → Ler QR Code</strong> e confirme o pagamento de{" "}
            <strong className="pix-valor">{formatMoney(valor)}</strong>.
          </p>
          <p className="muted" role="status">Aguardando a confirmação do pagamento pela loja.</p>
          {erroVerificacao && <Alert>{erroVerificacao}</Alert>}
          <div
            className="pix-qr"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <p className="muted">Ou use o Pix copia e cola:</p>
          <textarea
            className="pix-codigo"
            readOnly
            rows={4}
            value={codigo}
            aria-label="Código Pix copia e cola"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button type="button" className="btn btn-outline" onClick={copiar}>
            {copiado ? "Código copiado!" : "Copiar código Pix"}
          </button>
          <small className="muted">O valor já vem preenchido, não precisa digitar nada. Guarde o comprovante do pagamento.</small>
          <Link to="/loja/conta" className="btn btn-primary">Ver meus pedidos</Link>
        </>
      )}
    </section>
  );
}
