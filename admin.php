<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Y3D Creations | Painel Admin</title>
<link rel="stylesheet" href="admin.css">
</head>
<body>
<aside>
  <div class="brand"><div class="scene"><div class="cube"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
    <div><b>Y3D</b><small>CREATIONS</small></div></div>
  <nav>
    <a class="on" href="#">📊 Dashboard</a>
    <a href="#clientes">👥 Clientes</a>
    <a href="#">🧊 Produtos</a>
    <a href="#">🧾 Pedidos</a>
    <a href="#">⭐ Avaliações</a>
    <a href="#">✉️ Mensagens</a>
    <a href="#">🚪 Sair</a>
  </nav>
</aside>

<main>
  <header>
    <div><h1>Painel <span>Administrativo</span></h1><p>Visão geral da loja de modelos 3D</p></div>
    <div class="user"><span>Administrador</span><div class="avatar">A</div></div>
  </header>

  <section class="kpis" id="kpis"></section>

  <section class="grid">
    <div class="panel"><h2>Faturamento mensal <em>últimos 6 meses</em></h2><div class="chart" id="chart"></div></div>
    <div class="panel"><h2>Top clientes <em>por gasto</em></h2><ul class="top" id="top"></ul></div>
  </section>

  <section class="panel" id="clientes">
    <h2>Clientes cadastrados <em id="count"></em></h2>
    <div class="tools">
      <input id="q" placeholder="Buscar por nome, e-mail, telefone ou CPF...">
      <select id="st"><option value="">Todos os status</option><option value="ativo">Ativos</option><option value="inativo">Inativos</option></select>
    </div>
    <div class="wrap"><table>
      <thead><tr><th>Cliente</th><th>CPF</th><th>Telefone</th><th>E-mail</th><th>Pedidos</th><th>Total gasto</th><th>Status</th></tr></thead>
      <tbody id="rows"></tbody>
    </table></div>
  </section>
</main>

<script>
/* ===== DADOS DE EXEMPLO =====
   Troque por: fetch('api/clientes.php').then(r=>r.json()).then(d=>{clientes=d;render()})
   Campos esperados: nome, cpf, telefone, email, pedidos, gasto, status */
let clientes=[
 {nome:'Lucas Ferreira',cpf:'123.456.789-09',telefone:'(44) 98811-1111',email:'lucas@email.com',pedidos:6,gasto:214.60,status:'ativo'},
 {nome:'Rafael Costa',cpf:'987.654.321-00',telefone:'(44) 98822-2222',email:'rafael@email.com',pedidos:4,gasto:139.70,status:'ativo'},
 {nome:'Bruno Martins',cpf:'456.123.789-55',telefone:'(44) 98833-3333',email:'bruno@email.com',pedidos:2,gasto:64.80,status:'ativo'},
 {nome:'Marcos Oliveira',cpf:'321.654.987-11',telefone:'(43) 99712-4455',email:'marcos@email.com',pedidos:9,gasto:389.10,status:'ativo'},
 {nome:'Diego Santos',cpf:'741.852.963-22',telefone:'(41) 99655-7788',email:'diego@email.com',pedidos:1,gasto:19.90,status:'inativo'},
 {nome:'Felipe Rocha',cpf:'159.753.486-33',telefone:'(44) 98700-1234',email:'felipe@email.com',pedidos:3,gasto:92.70,status:'ativo'},
 {nome:'Ana Beatriz Lima',cpf:'852.963.741-44',telefone:'(44) 99123-9087',email:'ana@email.com',pedidos:5,gasto:176.50,status:'ativo'},
 {nome:'Camila Duarte',cpf:'963.852.147-66',telefone:'(42) 99801-3322',email:'camila@email.com',pedidos:0,gasto:0,status:'inativo'}
];
const meses=[['Abr',820],['Mai',1180],['Jun',960],['Jul',1540],['Ago',1320],['Set',1890]];
const brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const mask=c=>'•••.•••.•••-'+c.slice(-2);
const ini=n=>n.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
const shown=new Set();

function kpis(){
  const receita=clientes.reduce((s,c)=>s+c.gasto,0),ped=clientes.reduce((s,c)=>s+c.pedidos,0);
  const d=[['👥','Clientes',clientes.length],['💰','Receita total',brl(receita)],['🧾','Pedidos',ped],['🎯','Ticket médio',brl(ped?receita/ped:0)]];
  document.getElementById('kpis').innerHTML=d.map(k=>`<div class="kpi"><div class="ico">${k[0]}</div><small>${k[1]}</small><strong>${k[2]}</strong></div>`).join('');
  document.querySelectorAll('.kpi').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      el.style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg) translateZ(10px)`});
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
}
function chart(){
  const max=Math.max(...meses.map(m=>m[1]));
  document.getElementById('chart').innerHTML=meses.map(m=>`<div class="bar"><span>${brl(m[1]).replace(',00','')}</span><div style="height:${m[1]/max*78}%" title="${brl(m[1])}"></div>${m[0]}</div>`).join('');
}
function top(){
  document.getElementById('top').innerHTML=[...clientes].sort((a,b)=>b.gasto-a.gasto).slice(0,5)
   .map((c,i)=>`<li><div><span class="rank" style="color:#fff">${i+1}</span>${c.nome}</div><span>${brl(c.gasto)}</span></li>`).join('');
}
function render(){
  const q=document.getElementById('q').value.toLowerCase().trim(),st=document.getElementById('st').value;
  const list=clientes.filter(c=>(!st||c.status===st)&&(!q||[c.nome,c.email,c.telefone,c.cpf].join(' ').toLowerCase().includes(q)));
  document.getElementById('count').textContent=list.length+' resultado(s)';
  document.getElementById('rows').innerHTML=list.length?list.map(c=>`<tr>
    <td><div class="who"><div class="avatar">${ini(c.nome)}</div>${c.nome}</div></td>
    <td><span class="cpf">${shown.has(c.cpf)?c.cpf:mask(c.cpf)}</span><button class="eye" onclick="tg('${c.cpf}')">${shown.has(c.cpf)?'ocultar':'ver'}</button></td>
    <td>${c.telefone}</td><td>${c.email}</td><td>${c.pedidos}</td><td>${brl(c.gasto)}</td>
    <td><span class="tag ${c.status}">${c.status}</span></td></tr>`).join('')
    :'<tr><td colspan="7" class="empty">Nenhum cliente encontrado</td></tr>';
}
function tg(c){shown.has(c)?shown.delete(c):shown.add(c);render()}
document.getElementById('q').oninput=render;document.getElementById('st').onchange=render;
kpis();chart();top();render();
</script>
</body>
</html>