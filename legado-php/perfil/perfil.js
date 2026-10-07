// js/perfil.js
const $ = id => document.getElementById(id);
const lateral = $('lateral');
let fotoUrl = lateral.dataset.fotoUrl || '';
let nomeAtual = $('nomeView').textContent.trim();

/* ---------- utilitários ---------- */
let toastTimer;
function aviso(msg, erro = false) {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show' + (erro ? ' erro' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = 'toast', 3200);
}

async function enviar(fd) {
  fd.append('csrf', window.CSRF);
  const r = await fetch('api/perfil.php', { method: 'POST', body: fd, credentials: 'same-origin' });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.ok) throw new Error(d.erro || 'Erro inesperado. Tente novamente.');
  return d;
}

// Atualiza TODOS os avatares e nomes da página (inclusive o do cabeçalho)
function pintar(nome, url) {
  document.querySelectorAll('[data-avatar]').forEach(el => {
    el.textContent = '';
    if (url) {
      const img = document.createElement('img');
      img.src = url; img.alt = '';
      el.appendChild(img);
    } else {
      el.textContent = (nome || '?').trim().charAt(0).toUpperCase();
    }
  });
  $('btnRemover').hidden = !url;
}

/* ---------- trocar foto ---------- */
$('fotoInput').addEventListener('change', async e => {
  const arq = e.target.files[0];
  e.target.value = '';                      // permite escolher o mesmo arquivo de novo
  if (!arq) return;

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(arq.type)) {
    return aviso('Use uma imagem JPG, PNG ou WEBP.', true);
  }
  if (arq.size > 2 * 1024 * 1024) {
    return aviso('A imagem deve ter no máximo 2 MB.', true);
  }

  const previa = URL.createObjectURL(arq);  // mostra na hora, antes de salvar
  pintar(nomeAtual, previa);
  document.querySelector('.avatar-box').classList.add('enviando');

  try {
    const fd = new FormData();
    fd.append('acao', 'foto');
    fd.append('foto', arq);
    const d = await enviar(fd);
    fotoUrl = d.url;
    pintar(nomeAtual, fotoUrl);
    aviso('Foto atualizada!');
  } catch (err) {
    pintar(nomeAtual, fotoUrl);             // volta para a foto anterior
    aviso(err.message, true);
  } finally {
    document.querySelector('.avatar-box').classList.remove('enviando');
    URL.revokeObjectURL(previa);
  }
});

/* ---------- remover foto ---------- */
$('btnRemover').addEventListener('click', async () => {
  if (!confirm('Remover sua foto de perfil?')) return;
  try {
    const fd = new FormData();
    fd.append('acao', 'remover_foto');
    await enviar(fd);
    fotoUrl = '';
    pintar(nomeAtual, '');
    aviso('Foto removida.');
  } catch (err) {
    aviso(err.message, true);
  }
});

/* ---------- editar nome ---------- */
const form = $('nomeForm');
function modoEdicao(ativo) {
  form.hidden = !ativo;
  $('nomeView').hidden = ativo;
  $('nomeEditar').hidden = ativo;
  if (ativo) { $('nomeInput').value = nomeAtual; $('nomeInput').focus(); $('nomeInput').select(); }
}
$('nomeEditar').addEventListener('click', () => modoEdicao(true));
$('nomeCancel').addEventListener('click', () => modoEdicao(false));

form.addEventListener('submit', async e => {
  e.preventDefault();
  const novo = $('nomeInput').value.trim().replace(/\s+/g, ' ');
  if (novo === nomeAtual) return modoEdicao(false);
  if (novo.length < 2) return aviso('O nome deve ter pelo menos 2 caracteres.', true);

  try {
    const fd = new FormData();
    fd.append('acao', 'nome');
    fd.append('nome', novo);
    const d = await enviar(fd);
    nomeAtual = d.nome;
    document.querySelectorAll('[data-nome]').forEach(el => el.textContent = nomeAtual);
    $('nomeLateral').textContent = nomeAtual;
    if (!fotoUrl) pintar(nomeAtual, '');    // a inicial do avatar acompanha o novo nome
    modoEdicao(false);
    aviso('Nome atualizado!');
  } catch (err) {
    aviso(err.message, true);
  }
});