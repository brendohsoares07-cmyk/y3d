import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { RespostaCheckout } from "../../shared/tipos";
import { api, mensagemDeErro } from "../api";
import { AvaliarAtendimento } from "../componentes/AvaliarAtendimento";
import { srcImagem } from "../componentes/CartaoProduto";
import { useAvisos } from "../contextos/Avisos";
import { useCarrinho } from "../contextos/Carrinho";
import { cpfValido, mascararCpf, somenteDigitos } from "../cpf";
import { useTitulo } from "../estilos";
import { formatarPreco } from "../formatar";
import { gerarQr, montarPix, qrParaSvg } from "../pix";

const ESTILO = `
.checkout-erro{border:1px solid #ff6b6b;background:rgba(255,107,107,.12);color:#ffd5d5;padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:16px}
.checkout-cpf-erro{color:#ff9c9c;font-size:11.5px}
.checkout-cpf-erro[hidden]{display:none}
.checkout-cep-status{color:#7fe0b0;font-size:11.5px}
.checkout-cep-status.is-erro{color:#ff9c9c}
.checkout-cep-status[hidden]{display:none}
.checkout-fields label.is-invalid input{border-color:#ff6b6b;box-shadow:0 0 0 3px rgba(255,107,107,.18)}
.checkout-fields label.is-valid input{border-color:#38d39f}
`;

interface ViaCep { erro?: boolean | string; logradouro?: string; bairro?: string; localidade?: string; uf?: string }

function PixPagamento({ pedidoId, valor, aoInformar }: { pedidoId: number; valor: number; aoInformar: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const codigo = useMemo(() => montarPix(valor), [valor]);
  const svg = useMemo(() => qrParaSvg(gerarQr(codigo)), [codigo]);
  const campo = useRef<HTMLTextAreaElement>(null);
  const { avisar } = useAvisos();

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch {
      campo.current?.select();
      document.execCommand("copy");
    }
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2000);
  };

  const informar = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api(`/pedidos/${pedidoId}/pix-informado`, { metodo: "POST" });
      avisar("Pagamento Pix informado. O pedido aguarda a conferência do administrador.");
      aoInformar();
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  };

  return (
    <div className="checkout-success pix-box" data-pix-valor={valor.toFixed(2)}>
      <h1>Pedido recebido! Aguardando pagamento</h1>
      <p>Abra o app do seu banco, escolha <b>Pix → Ler QR Code</b> e confirme o pagamento de <b className="pix-valor">{formatarPreco(valor)}</b>.</p>
      <p className="pix-aviso" role="status" aria-live="polite"><b>Status do pedido: Aguardando pagamento.</b> Depois de fazer o Pix, aguarde a conferência manual do administrador, que atualizará o status no painel.</p>
      <div className="pix-qr" aria-live="polite" dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="pix-ou">Ou use o Pix copia e cola:</p>
      <textarea className="pix-codigo" ref={campo} readOnly rows={4} aria-label="Código Pix copia e cola" value={codigo} />
      <button type="button" className="btn btn-outline" onClick={() => void copiar()}>{copiado ? "Código copiado!" : "Copiar código Pix"}</button>
      <p className="pix-aviso">O valor já vem preenchido, não precisa digitar nada. Guarde o comprovante: ele confirma o seu pedido.</p>
      {erro && <p className="pix-aviso" role="alert">{erro}</p>}
      <form onSubmit={(e) => void informar(e)}>
        <button type="submit" className="btn btn-grad">Já fiz o Pix — solicitar verificação</button>
      </form>
      <Link to="/produtos" className="btn btn-grad">Continuar comprando</Link>
    </div>
  );
}

export function PaginaCheckout() {
  useTitulo("Finalizar compra");
  const { itens, subtotal, limpar } = useCarrinho();
  const [concluido, setConcluido] = useState<RespostaCheckout | null>(null);
  const [pixVerificacao, setPixVerificacao] = useState<{ id: number; status: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [campos, setCampos] = useState({ nome: "", telefone: "", cpf: "", cep: "", endereco: "", bairro: "", cidade: "", pagamento: "" });
  const [cpfMsg, setCpfMsg] = useState("");
  const [cpfEstado, setCpfEstado] = useState<"" | "invalido" | "valido">("");
  const [cepMsg, setCepMsg] = useState<{ texto: string; erro: boolean }>({ texto: "", erro: false });
  const ultimoCep = useRef("");
  const busca = useRef(0);
  const refEndereco = useRef<HTMLInputElement>(null);

  // pedido Pix que a pessoa já disse ter pago (mostra o status ao recarregar a página)
  useEffect(() => {
    api<{ pedido: { id: number; status: string } | null }>("/pedidos/pix-atual").then((r) => setPixVerificacao(r.pedido)).catch(() => undefined);
  }, []);

  const definir = (campo: keyof typeof campos) => (e: ChangeEvent<HTMLInputElement>) => setCampos((c) => ({ ...c, [campo]: e.target.value }));

  // CPF: máscara + validação (mesma regra do PHP)
  const conferirCpf = (valor: string, mostrarVazio: boolean): boolean => {
    const d = somenteDigitos(valor);
    let msg = "";
    if (d.length === 0) { if (mostrarVazio) msg = "Digite seu CPF."; }
    else if (d.length < 11) { if (mostrarVazio) msg = "O CPF precisa ter 11 números."; }
    else if (!cpfValido(d)) msg = "CPF inválido. Confira os números.";
    const ok = d.length === 11 && msg === "";
    setCpfMsg(msg);
    setCpfEstado(msg !== "" ? "invalido" : ok ? "valido" : "");
    return ok;
  };

  // CEP: preenche rua, bairro e cidade pelo ViaCEP
  const aoMudarCep = (e: ChangeEvent<HTMLInputElement>) => {
    const d = somenteDigitos(e.target.value).slice(0, 8);
    const valor = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    setCampos((c) => ({ ...c, cep: valor }));
    if (d.length < 8) { ultimoCep.current = ""; busca.current++; setCepMsg({ texto: "", erro: false }); return; }
    if (d === ultimoCep.current) return;
    ultimoCep.current = d;
    void (async () => {
      const minha = ++busca.current;
      const controle = new AbortController();
      const limite = window.setTimeout(() => controle.abort(), 8000);
      setCepMsg({ texto: "Buscando endereço...", erro: false });
      try {
        const resp = await fetch(`https://viacep.com.br/ws/${d}/json/`, { signal: controle.signal });
        if (!resp.ok) throw new Error(`http ${resp.status}`);
        const dados = (await resp.json()) as ViaCep;
        if (minha !== busca.current) return;
        if (dados.erro) return setCepMsg({ texto: "CEP não encontrado. Confira os números ou preencha o endereço manualmente.", erro: true });
        setCampos((c) => ({
          ...c,
          endereco: dados.logradouro ? `${dados.logradouro}, ` : c.endereco,
          bairro: dados.bairro || c.bairro,
          cidade: dados.localidade ? (dados.uf ? `${dados.localidade} - ${dados.uf}` : dados.localidade) : c.cidade,
        }));
        setCepMsg({ texto: "Endereço encontrado. Falta só o número e o complemento.", erro: false });
        window.setTimeout(() => {
          const el = refEndereco.current;
          el?.focus();
          if (dados.logradouro && el) el.setSelectionRange(el.value.length, el.value.length);
        }, 0);
      } catch {
        if (minha === busca.current) setCepMsg({ texto: "Não foi possível buscar o CEP agora. Preencha o endereço manualmente.", erro: true });
      } finally {
        window.clearTimeout(limite);
      }
    })();
  };

  const finalizar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (!conferirCpf(campos.cpf, true)) return;
    setEnviando(true);
    try {
      const r = await api<RespostaCheckout>("/pedidos", { corpo: { ...campos, itens: itens.map((i) => ({ id: i.produto.id, quantidade: i.quantidade })) } });
      limpar();
      setPixVerificacao(null);
      setConcluido(r);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  };

  // ---------- telas de resultado ----------
  if (concluido && concluido.pagamento === "pix" && concluido.total > 0) {
    return (
      <>
        <PixPagamento pedidoId={concluido.pedidoId} valor={concluido.total} aoInformar={() => { setPixVerificacao({ id: concluido.pedidoId, status: "aguardando" }); setConcluido(null); }} />
        <AvaliarAtendimento pedidoId={concluido.pedidoId} />
      </>
    );
  }
  if (pixVerificacao && itens.length === 0) {
    const { id, status } = pixVerificacao;
    return (
      <div className="checkout-success pix-box">
        {status === "aguardando" ? (
          <>
            <h1>Pagamento enviado para verificação</h1>
            <p className="pix-aviso" role="status" aria-live="polite">Você informou que realizou o Pix. O administrador vai conferir o pagamento e atualizar o status do pedido no painel.</p>
            <p className="pix-aviso"><b>Status do pedido: Aguardando pagamento.</b></p>
          </>
        ) : ["pago", "enviado", "entregue"].includes(status) ? (
          <>
            <h1>Pagamento verificado!</h1>
            <p className="pix-aviso" role="status">O administrador confirmou o pagamento do pedido #{id}.</p>
          </>
        ) : (
          <>
            <h1>Pedido cancelado</h1>
            <p className="pix-aviso" role="status">O pedido #{id} foi cancelado. Entre em contato com a loja se precisar de ajuda.</p>
          </>
        )}
        <Link to="/produtos" className="btn btn-grad">Continuar comprando</Link>
      </div>
    );
  }
  if (concluido) {
    return (
      <>
        <div className="checkout-success">
          <span>✓</span>
          <h1>Pedido recebido!</h1>
          <p>Seu pedido foi registrado para demonstração. Em breve você receberá as instruções de pagamento e envio.</p>
          <Link to="/produtos" className="btn btn-grad">Continuar comprando</Link>
        </div>
        <AvaliarAtendimento pedidoId={concluido.pedidoId} />
      </>
    );
  }
  if (itens.length === 0) {
    return (
      <div className="checkout-empty">
        <h1>Seu carrinho está vazio</h1>
        <p>Adicione um produto antes de finalizar a compra.</p>
        <Link to="/produtos" className="btn btn-grad">Ver produtos</Link>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={(e) => void finalizar(e)} noValidate>
          {erro && <div className="checkout-erro" role="alert">{erro}</div>}
          <div className="checkout-section">
            <div className="checkout-heading"><span>1</span><h1>Endereço de entrega</h1></div>
            <div className="checkout-fields">
              <label>Nome completo<input type="text" name="nome" required placeholder="Seu nome completo" value={campos.nome} onChange={definir("nome")} /></label>
              <label>Telefone<input type="tel" name="telefone" required placeholder="(00) 00000-0000" value={campos.telefone} onChange={definir("telefone")} /></label>
              <label className={cpfEstado ? `is-${cpfEstado}` : undefined}>CPF
                <input id="checkout-cpf" type="text" name="cpf" required placeholder="000.000.000-00" inputMode="numeric" maxLength={14} autoComplete="off" value={campos.cpf}
                  onChange={(e) => { const v = mascararCpf(e.target.value); setCampos((c) => ({ ...c, cpf: v })); conferirCpf(v, false); }}
                  onBlur={() => conferirCpf(campos.cpf, true)} />
                <small className="checkout-cpf-erro" hidden={cpfMsg === ""}>{cpfMsg}</small>
              </label>
              <label>CEP
                <input id="checkout-cep" type="text" name="cep" required placeholder="00000-000" inputMode="numeric" maxLength={9} autoComplete="postal-code" value={campos.cep} onChange={aoMudarCep} />
                <small className={`checkout-cep-status${cepMsg.erro ? " is-erro" : ""}`} hidden={cepMsg.texto === ""}>{cepMsg.texto}</small>
              </label>
              <label className="field-wide">Endereço<input id="checkout-endereco" ref={refEndereco} type="text" name="endereco" required placeholder="Rua, número e complemento" value={campos.endereco} onChange={definir("endereco")} /></label>
              <label>Bairro<input id="checkout-bairro" type="text" name="bairro" required placeholder="Seu bairro" value={campos.bairro} onChange={definir("bairro")} /></label>
              <label>Cidade<input id="checkout-cidade" type="text" name="cidade" required placeholder="Sua cidade" value={campos.cidade} onChange={definir("cidade")} /></label>
            </div>
          </div>
          <div className="checkout-section">
            <div className="checkout-heading"><span>2</span><h2>Forma de pagamento</h2></div>
            <div className="payment-options">
              {([["pix", "Pix", "Pagamento imediato · QR Code ao finalizar"], ["cartao", "Cartão de crédito", "Até 12x"], ["boleto", "Boleto bancário", "Vencimento em 3 dias"]] as const).map(([valor, nome, detalhe]) => (
                <label key={valor}><input type="radio" name="pagamento" value={valor} required checked={campos.pagamento === valor} onChange={definir("pagamento")} /> {nome} <small>{detalhe}</small></label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-grad checkout-submit" disabled={enviando}>Finalizar pedido</button>
          <small className="checkout-safe">🔒 Seus dados estão protegidos</small>
        </form>

        <aside className="checkout-summary">
          <div className="checkout-heading"><span>3</span><h2>Revisão do pedido</h2></div>
          <div className="checkout-items">
            {itens.map(({ produto: p, quantidade, subtotal: linha }) => (
              <div className="checkout-item" key={p.id}>
                <div className="checkout-item-image">{p.imagemPrincipal ? <img src={srcImagem(p.imagemPrincipal)} alt="" /> : p.emoji}</div>
                <div><b>{p.nome}</b><small>{quantidade} unidade{quantidade === 1 ? "" : "s"}</small></div>
                <strong>{formatarPreco(linha)}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-total-row"><span>Subtotal</span><strong>{formatarPreco(subtotal)}</strong></div>
          <div className="checkout-total-row checkout-grand-total"><span>Total</span><strong>{formatarPreco(subtotal)}</strong></div>
          <Link to="/carrinho" className="checkout-back">← Voltar ao carrinho</Link>
        </aside>
      </div>
      <style>{ESTILO}</style>
    </>
  );
}
