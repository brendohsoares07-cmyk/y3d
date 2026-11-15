import { useCallback, useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import type { FormularioProduto, PainelAdmin, Pedido, StatusPedido } from "../../shared/tipos";
import { api, mensagemDeErro } from "../api";
import { useSessao } from "../contextos/Sessao";
import { formatarCpf, mascaraCpfOculto } from "../cpf";
import { useTitulo } from "../estilos";
import { dataHora, estrelasTexto, formatarPreco, iniciais } from "../formatar";

const ABAS: Record<string, [string, string]> = {
  dashboard: ["📊", "Dashboard"],
  clientes: ["👥", "Clientes"],
  produtos: ["🧊", "Produtos"],
  pedidos: ["🧾", "Pedidos"],
  avaliacoes: ["⭐", "Avaliações"],
  mensagens: ["✉️", "Mensagens"],
};
const SUBTITULOS: Record<string, string> = {
  dashboard: "Visão geral da loja de modelos 3D",
  clientes: "Quem já se cadastrou ou comprou na loja",
  produtos: "Catálogo, vendas e notas de cada produto",
  pedidos: "Pedidos feitos no site, com endereço e status",
  avaliacoes: "O que os clientes acharam dos produtos",
  mensagens: "Mensagens enviadas pela página de contato",
};
const STATUS: Record<StatusPedido, string> = { aguardando: "Aguardando pagamento", pago: "Pago", enviado: "Enviado", entregue: "Entregue", cancelado: "Cancelado" };
const PAGAMENTOS: Record<string, string> = { pix: "Pix", cartao: "Cartão de crédito", boleto: "Boleto" };

type Aviso = { tipo: "sucesso" | "erro"; mensagem: string };
type Acao = (promessa: Promise<unknown>, opcoes?: { sucesso?: string }) => Promise<boolean>;


// ---------- abas ----------

function Dashboard({ p }: { p: PainelAdmin }) {
  const maior = Math.max(0, ...p.faturamento.map((f) => f.valor));
  const inclinar = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(10px)`;
  };
  const kpis: [string, string, string | number][] = [
    ["👥", "Clientes", p.clientes.length], ["💰", "Receita total", formatarPreco(p.receita)], ["🧾", "Pedidos", p.qtdPedidosValidos],
    ["🎯", "Ticket médio", formatarPreco(p.ticketMedio)], ["⭐", "Avaliações", p.avaliacoes.length], ["✉️", "Mensagens novas", p.mensagensNovas],
  ];
  return (
    <>
      <section className="kpis" id="kpis">
        {kpis.map(([ico, rotulo, valor]) => (
          <div className="kpi" key={rotulo} onMouseMove={inclinar} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}>
            <div className="ico">{ico}</div><small>{rotulo}</small><strong>{valor}</strong>
          </div>
        ))}
      </section>

      <section className="grid">
        <div className="panel"><h2>Faturamento mensal <em>últimos 6 meses</em></h2>
          <div className="chart">
            {p.faturamento.map((f, i) => (
              <div className="bar" key={i}><span>{formatarPreco(f.valor)}</span>
                <div style={{ height: `${maior > 0 ? Math.round((f.valor / maior) * 78 * 10) / 10 : 0}%` }} title={formatarPreco(f.valor)}></div>{f.rotulo}</div>
            ))}
          </div>
        </div>
        <div className="panel"><h2>Top clientes <em>por gasto</em></h2>
          {p.topClientes.length === 0 ? <p className="empty">Ainda não há compras.</p> : (
            <ul className="top">
              {p.topClientes.map((c, i) => <li key={i}><div><span className="rank" style={{ color: "#fff" }}>{i + 1}</span>{c.nome}</div><span>{formatarPreco(c.gasto)}</span></li>)}
            </ul>
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Últimos pedidos <em><Link className="vermais" to="/admin?aba=pedidos">ver todos</Link></em></h2>
        {p.pedidos.length === 0 ? (
          <p className="empty">Nenhum pedido ainda. Quando alguém finalizar uma compra no site, ele aparece aqui.</p>
        ) : (
          <div className="wrap"><table>
            <thead><tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {p.pedidos.slice(0, 5).map((pd) => (
                <tr key={pd.id}><td>#{pd.id}</td><td>{dataHora(pd.criado_em)}</td><td>{pd.nome}</td><td>{formatarPreco(pd.total)}</td>
                  <td><span className={`tag st-${pd.status}`}>{STATUS[pd.status]}</span></td></tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>
    </>
  );
}

function Clientes({ p }: { p: PainelAdmin }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [abertos, setAbertos] = useState<Set<number>>(new Set());
  const termo = busca.toLowerCase().trim();
  const linhas = p.clientes.map((c, i) => ({ c, i, status: c.pedidos > 0 ? "ativo" : "inativo", texto: `${c.nome} ${c.email} ${c.telefone} ${c.cpf} ${formatarCpf(c.cpf)}`.toLowerCase() }));
  const visiveis = linhas.filter((l) => (!filtro || l.status === filtro) && (!termo || l.texto.includes(termo)));
  const alternar = (i: number) => setAbertos((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });

  return (
    <section className="panel" id="clientes">
      <h2>Clientes cadastrados <em id="count">{visiveis.length} resultado(s)</em></h2>
      <div className="tools">
        <input id="busca" placeholder="Buscar por nome, e-mail, telefone ou CPF..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select id="filtro-status" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todos os status</option><option value="ativo">Ativos (já compraram)</option><option value="inativo">Inativos (sem compras)</option>
        </select>
      </div>
      <div className="wrap"><table>
        <thead><tr><th>Cliente</th><th>CPF</th><th>Telefone</th><th>E-mail</th><th>Pedidos</th><th>Total gasto</th><th>Status</th></tr></thead>
        <tbody id="linhas-clientes">
          {visiveis.map(({ c, i, status }) => (
            <tr key={i}>
              <td><div className="who"><div className="avatar">{iniciais(c.nome)}</div>{c.nome}{c.convidado && <> <small className="convidado">sem conta</small></>}</div></td>
              <td>
                {c.cpf === "" ? <span className="cpf">—</span> : (
                  <>
                    <span className="cpf">{abertos.has(i) ? formatarCpf(c.cpf) : mascaraCpfOculto(c.cpf)}</span>
                    <button type="button" className="mini" onClick={() => alternar(i)}>{abertos.has(i) ? "ocultar" : "ver"}</button>
                  </>
                )}
              </td>
              <td>{c.telefone !== "" ? c.telefone : "—"}</td>
              <td>{c.email !== "" ? c.email : "—"}</td>
              <td>{c.pedidos}</td>
              <td>{formatarPreco(c.gasto)}</td>
              <td><span className={`tag ${status}`}>{status}</span></td>
            </tr>
          ))}
          {visiveis.length === 0 && <tr className="vazio-linha"><td colSpan={7} className="empty">{p.clientes.length ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado ainda"}</td></tr>}
        </tbody>
      </table></div>
    </section>
  );
}

const VAZIO: FormularioProduto = { nome: "", categoria: "", preco: "", imagem: "", emoji: "📦", cor1: "#3ddbf2", cor2: "#7c5cff", descricao: "", tamanho: "" };

function FormularioDeProduto({ p, id, aoSalvar, aviso }: { p: PainelAdmin; id: number; aoSalvar: Acao; aviso: (a: Aviso) => void }) {
  const navigate = useNavigate();
  const existente = id > 0 ? p.produtos.find((x) => x.produto.id === id)?.produto : undefined;
  const [f, setF] = useState<FormularioProduto>(() =>
    existente
      ? { nome: existente.nome, categoria: existente.categoria, preco: String(existente.preco), imagem: existente.imagem, emoji: existente.emoji, cor1: existente.cor1, cor2: existente.cor2, descricao: existente.descricao, tamanho: existente.tamanho }
      : VAZIO,
  );
  const mudar = (campo: keyof FormularioProduto) => (e: { target: { value: string } }) => setF((v) => ({ ...v, [campo]: e.target.value }));

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await aoSalvar(api(id > 0 ? `/admin/produtos/${id}` : "/admin/produtos", { metodo: id > 0 ? "PUT" : "POST", corpo: f }), { sucesso: "Produto salvo com sucesso." });
    if (ok) navigate("/admin?aba=produtos");
    else aviso({ tipo: "erro", mensagem: "Corrija os dados e tente de novo." });
  };

  return (
    <form className="product-form" onSubmit={(e) => void salvar(e)}>
      <h3>{id > 0 ? "Editar produto" : "Adicionar produto"}</h3>
      <div className="product-form-grid">
        <label>Nome<input name="nome" required maxLength={100} value={f.nome} onChange={mudar("nome")} /></label>
        <label>Categoria
          <select name="categoria" required value={f.categoria} onChange={mudar("categoria")}>
            <option value="">Selecione</option>
            {Object.entries(p.categorias).map(([chave, c]) => <option key={chave} value={chave}>{c.nome}</option>)}
          </select>
        </label>
        <label>Preço (R$)<input name="preco" type="number" min="0.01" max="1000000" step="0.01" required value={f.preco} onChange={mudar("preco")} /></label>
        <label>Imagem (caminho ou URL)<input name="imagem" maxLength={500} placeholder="assets/img/produtos/produto.jpg" value={f.imagem} onChange={mudar("imagem")} /></label>
        <label>Ícone/emoji<input name="emoji" maxLength={8} value={f.emoji} onChange={mudar("emoji")} /></label>
        <label>Tamanho ou formato<input name="tamanho" maxLength={160} placeholder="Impressa em 3D pela Y3D Creations" value={f.tamanho} onChange={mudar("tamanho")} /></label>
        <label>Cor principal<input name="cor1" type="color" value={f.cor1} onChange={mudar("cor1")} /></label>
        <label>Cor secundária<input name="cor2" type="color" value={f.cor2} onChange={mudar("cor2")} /></label>
        <label className="product-form-wide">Descrição<textarea name="descricao" rows={4} maxLength={2000} value={f.descricao} onChange={mudar("descricao")}></textarea></label>
      </div>
      <div className="product-form-actions">
        <button type="submit" className="mini">Salvar produto</button>
        <Link className="mini cancelar" to="/admin?aba=produtos">Cancelar</Link>
      </div>
    </form>
  );
}

function Produtos({ p, acao, aviso, formulario }: { p: PainelAdmin; acao: Acao; aviso: (a: Aviso) => void; formulario: string | null }) {
  const idForm = formulario === "novo" ? 0 : /^\d+$/.test(formulario ?? "") ? Number(formulario) : -1;
  const formAberto = formulario !== null && (idForm === 0 || (idForm > 0 && p.produtos.some((x) => x.produto.id === idForm)));
  return (
    <section className="panel">
      <h2>Produtos <em>{p.produtos.length} no catálogo</em><Link className="mini" to="/admin?aba=produtos&produto=novo">Adicionar produto</Link></h2>
      {formAberto && <FormularioDeProduto key={formulario} p={p} id={idForm} aoSalvar={acao} aviso={aviso} />}
      <div className="wrap"><table>
        <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Vendidos</th><th>Nota</th><th>Ações</th></tr></thead>
        <tbody>
          {p.produtos.map(({ produto, vendidos, media, qtdAvaliacoes }) => {
            const foto = produto.miniaturas[0] ?? produto.imagemPrincipal;
            return (
              <tr key={produto.id}>
                <td><div className="who">
                  {foto ? <img className="thumb" src={/^https?:/i.test(foto) ? foto : `/${foto}`} alt="" width={36} height={36} style={{ width: 36, height: 36, maxWidth: 36 }} loading="lazy" /> : <div className="thumb thumb-emoji">{produto.emoji}</div>}
                  <span>{produto.nome}</span></div></td>
                <td>{p.categorias[produto.categoria]?.nome ?? produto.categoria}</td>
                <td>{formatarPreco(produto.preco)}</td>
                <td>{vendidos}</td>
                <td>{qtdAvaliacoes > 0 ? <><span className="estrelas">{estrelasTexto(media)}</span> {media} <small className="mudo">({qtdAvaliacoes})</small></> : <span className="mudo">sem avaliações</span>}</td>
                <td><div className="product-actions">
                  <Link className="eye" to={`/produto/${produto.id}`} target="_blank" rel="noopener">ver</Link>
                  <Link className="mini" to={`/admin?aba=produtos&produto=${produto.id}`}>Editar</Link>
                  <button type="button" className="mini perigo" onClick={() => {
                    if (window.confirm("Excluir este produto do catálogo? Os pedidos anteriores serão mantidos.")) void acao(api(`/admin/produtos/${produto.id}`, { metodo: "DELETE" }), { sucesso: "Produto excluído do catálogo. Os pedidos anteriores foram preservados." });
                  }}>Excluir</button>
                </div></td>
              </tr>
            );
          })}
        </tbody>
      </table></div>
    </section>
  );
}

function LinhaPedido({ pd, acao }: { pd: Pedido; acao: Acao }) {
  const [status, setStatus] = useState<StatusPedido>(pd.status);
  useEffect(() => { setStatus(pd.status); }, [pd.status]);
  const resumo = pd.itens.map((i) => `${i.quantidade || 1}× ${i.nome}`).join(", ");
  return (
    <tr>
      <td>#{pd.id}</td>
      <td>{dataHora(pd.criado_em)}</td>
      <td>
        <b>{pd.nome}</b>
        <details className="detalhes"><summary>endereço e contato</summary>
          <div>
            CPF: {formatarCpf(pd.cpf)}<br />
            Telefone: {pd.telefone}<br />
            {pd.email && <>E-mail: {pd.email}<br /></>}
            {pd.endereco}<br />
            {pd.bairro} — {pd.cidade}<br />
            CEP: {pd.cep}
          </div>
        </details>
      </td>
      <td>{resumo}</td>
      <td>
        {PAGAMENTOS[pd.pagamento] ?? (pd.pagamento !== "" ? pd.pagamento : "—")}
        {pd.pagamento === "pix" && pd.pix_informado_em && <><br /><small>Cliente informou Pix em {dataHora(pd.pix_informado_em)}</small></>}
      </td>
      <td>{formatarPreco(pd.total)}</td>
      <td>
        <form className="inline" onSubmit={(e) => { e.preventDefault(); void acao(api(`/admin/pedidos/${pd.id}/status`, { corpo: { status } })); }}>
          <select name="status" className={`sel-status st-${status}`} value={status} onChange={(e) => setStatus(e.target.value as StatusPedido)}>
            {Object.entries(STATUS).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
          </select>
          <button type="submit" className="mini">Salvar</button>
        </form>
      </td>
      <td>
        <button type="button" className="mini perigo" onClick={() => {
          if (window.confirm(`Excluir o pedido #${pd.id}? Esta ação não pode ser desfeita.`)) void acao(api(`/admin/pedidos/${pd.id}`, { metodo: "DELETE" }));
        }}>Excluir</button>
      </td>
    </tr>
  );
}

function Pedidos({ p, acao }: { p: PainelAdmin; acao: Acao }) {
  return (
    <section className="panel">
      <h2>Pedidos <em>{p.pedidos.length} no total</em></h2>
      {p.pedidos.length === 0 ? <p className="empty">Nenhum pedido ainda. Quando alguém finalizar uma compra no site, ele aparece aqui.</p> : (
        <div className="wrap"><table>
          <thead><tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Itens</th><th>Pagamento</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>{p.pedidos.map((pd) => <LinhaPedido key={pd.id} pd={pd} acao={acao} />)}</tbody>
        </table></div>
      )}
    </section>
  );
}

const Comentario = ({ texto }: { texto: string }) =>
  texto.trim() !== "" ? <td className="comentario" style={{ whiteSpace: "pre-line" }}>{texto}</td> : <td className="comentario"><span className="mudo">sem comentário</span></td>;

function Avaliacoes({ p, acao }: { p: PainelAdmin; acao: Acao }) {
  return (
    <>
      <section className="panel">
        <h2>Avaliações do atendimento <em>{p.avaliacoesAtendimento.length ? `${p.mediaAtendimento} de 5 · ${p.avaliacoesAtendimento.length} resposta(s)` : "nenhuma ainda"}</em></h2>
        {p.avaliacoesAtendimento.length === 0 ? (
          <p className="empty">Ainda ninguém avaliou o atendimento. A pergunta aparece para o cliente logo depois que ele finaliza o pedido.</p>
        ) : (
          <div className="wrap"><table>
            <thead><tr><th>Pedido</th><th>Cliente</th><th>Nota</th><th>Comentário</th><th>Data</th></tr></thead>
            <tbody>
              {p.avaliacoesAtendimento.map((pd) => (
                <tr key={pd.id}><td>#{pd.id}</td><td>{pd.nome}</td><td><span className="estrelas">{estrelasTexto(pd.avaliacao_atendimento?.nota ?? 0)}</span></td>
                  <Comentario texto={pd.avaliacao_atendimento?.comentario ?? ""} /><td>{dataHora(pd.avaliacao_atendimento?.criado_em ?? 0)}</td></tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <h2>Avaliações <em>{p.avaliacoes.length} no total</em></h2>
        {p.avaliacoes.length === 0 ? <p className="empty">Nenhuma avaliação ainda. Os clientes avaliam na página de cada produto.</p> : (
          <div className="wrap"><table>
            <thead><tr><th>Produto</th><th>Cliente</th><th>Nota</th><th>Comentário</th><th>Data</th><th></th></tr></thead>
            <tbody>
              {p.avaliacoes.map((av) => (
                <tr key={av.id}>
                  <td>{p.produtos.find((x) => x.produto.id === Number(av.produto_id))?.produto.nome ?? "Produto removido"}</td>
                  <td>{av.nome}</td><td><span className="estrelas">{estrelasTexto(av.nota)}</span></td><Comentario texto={av.comentario} /><td>{dataHora(av.criado_em)}</td>
                  <td><button type="button" className="mini perigo" onClick={() => { if (window.confirm("Remover esta avaliação?")) void acao(api(`/admin/avaliacoes/${av.id}`, { metodo: "DELETE" })); }}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>
    </>
  );
}

function Mensagens({ p, acao }: { p: PainelAdmin; acao: Acao }) {
  return (
    <section className="panel">
      <h2>Mensagens <em>{p.mensagensNovas} nova(s)</em></h2>
      {p.mensagens.length === 0 ? <p className="empty">Nenhuma mensagem ainda. Elas chegam pelo formulário da página Contato.</p> : (
        <div className="msgs">
          {p.mensagens.map((m) => (
            <article key={m.id} className={`msg${m.lida ? "" : " nova"}`}>
              <div className="msg-topo">
                <div><b>{m.nome}</b> <a href={`mailto:${m.email}`}>{m.email}</a></div>
                <small className="mudo">{dataHora(m.criado_em)}</small>
              </div>
              <p style={{ whiteSpace: "pre-line" }}>{m.mensagem}</p>
              <div className="msg-acoes">
                <a className="mini" href={`mailto:${m.email}?subject=${encodeURIComponent("Y3D Creations — resposta à sua mensagem")}`}>Responder por e-mail</a>
                {m.lida ? <span className="mudo">lida</span> : <button type="button" className="mini" onClick={() => void acao(api(`/admin/mensagens/${m.id}/lida`, { metodo: "POST" }))}>Marcar como lida</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- página ----------

export function PaginaAdmin() {
  useTitulo("Painel Admin");
  const { usuario, carregando, sair } = useSessao();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [painel, setPainel] = useState<PainelAdmin | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const abaPedida = params.get("aba") ?? "dashboard";
  const aba = abaPedida in ABAS ? abaPedida : "dashboard";

  const carregar = useCallback(async () => {
    try {
      setPainel(await api<PainelAdmin>("/admin/painel"));
    } catch (err) {
      setAviso({ tipo: "erro", mensagem: mensagemDeErro(err) });
    }
  }, []);

  useEffect(() => { if (usuario?.admin) void carregar(); }, [usuario, carregar, aba]);
  useEffect(() => { document.title = "Y3D Creations | Painel Admin"; }, []);

  if (carregando) return null;
  if (!usuario?.admin) return <Navigate to="/login" replace />;

  // roda uma ação do painel, mostra o resultado no aviso do topo e recarrega os dados
  const acao: Acao = async (promessa, opcoes) => {
    try {
      const r = (await promessa) as { sucesso?: string };
      const mensagem = r.sucesso ?? opcoes?.sucesso;
      setAviso(mensagem ? { tipo: "sucesso", mensagem } : null);
      await carregar();
      return true;
    } catch (err) {
      setAviso({ tipo: "erro", mensagem: mensagemDeErro(err) });
      return false;
    }
  };

  const deslogar = async () => { await sair(); navigate("/"); };
  const nome = usuario.nome || "Administrador";
  const p = painel;

  return (
    <>
      <aside>
        <div className="brand"><div className="scene"><div className="cube"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
          <div><b>Y3D</b><small>CREATIONS</small></div></div>
        <nav>
          {Object.entries(ABAS).map(([chave, [icone, rotulo]]) => (
            <Link key={chave} className={aba === chave ? "on" : undefined} to={`/admin?aba=${chave}`}>{icone} {rotulo}
              {chave === "mensagens" && p && p.mensagensNovas > 0 && <b className="badge">{p.mensagensNovas}</b>}
              {chave === "pedidos" && p && p.pedidosAguardando > 0 && <b className="badge">{p.pedidosAguardando}</b>}
            </Link>
          ))}
          <Link to="/">🏠 Ver a loja</Link>
          <a href="/" onClick={(e) => { e.preventDefault(); void deslogar(); }}>🚪 Sair</a>
        </nav>
      </aside>

      <main>
        <header>
          <div><h1>Painel <span>Administrativo</span></h1><p>{SUBTITULOS[aba]}</p></div>
          <div className="user"><span>{nome}</span><div className="avatar">{iniciais(nome)}</div></div>
        </header>
        {aviso && <div className={`admin-notice ${aviso.tipo}`} role="status">{aviso.mensagem}</div>}
        {aba === "produtos" && p?.catalogoErro && <div className="admin-notice erro" role="alert">{p.catalogoErro}</div>}

        {p && aba === "dashboard" && <Dashboard p={p} />}
        {p && aba === "clientes" && <Clientes p={p} />}
        {p && aba === "produtos" && <Produtos p={p} acao={acao} aviso={setAviso} formulario={params.get("produto")} />}
        {p && aba === "pedidos" && <Pedidos p={p} acao={acao} />}
        {p && aba === "avaliacoes" && <Avaliacoes p={p} acao={acao} />}
        {p && aba === "mensagens" && <Mensagens p={p} acao={acao} />}
      </main>
    </>
  );
}

