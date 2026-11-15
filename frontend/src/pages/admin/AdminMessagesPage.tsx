import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Alert } from "../../components/ui/Alert";
import { request } from "../../services/apiClient";

type Mensagem = { id: number; nome: string; email: string; mensagem: string; lida: number | boolean; criadoEm: string };
export function AdminMessagesPage() {
  const [mensagens,setMensagens] = useState<Mensagem[]>([]); const [erro,setErro] = useState("");
  const carregar = () => request<Mensagem[]>("/admin/mensagens").then(setMensagens).catch(e=>setErro(e instanceof Error ? e.message : "Não foi possível carregar as mensagens."));
  useEffect(()=>{carregar();},[]);
  const marcar = async (id:number) => { try { await request(`/admin/mensagens/${id}/lida`, { method: "POST", body: {} }); await carregar(); } catch(e) { setErro(e instanceof Error ? e.message : "Falha ao atualizar a mensagem."); } };
  return <div><PageHeader titulo="Mensagens de contato" subtitulo="Mensagens recebidas pelo formulário da loja"/>{erro && <Alert>{erro}</Alert>}<div className="admin-message-list">{mensagens.map(m=><article className="panel" key={m.id}><div><strong>{m.nome}</strong> · <a href={`mailto:${m.email}`}>{m.email}</a><small>{new Date(m.criadoEm).toLocaleString("pt-BR")}</small></div><p>{m.mensagem}</p>{!m.lida && <button className="btn btn-outline" onClick={()=>marcar(m.id)}>Marcar como lida</button>}</article>)}{mensagens.length===0 && <p className="muted">Nenhuma mensagem recebida.</p>}</div></div>;
}
