<?php
$enviado = false;
$erros = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $mensagem = trim($_POST['mensagem'] ?? '');
    if (mb_strlen($nome) < 2) $erros['nome'] = 'Digite seu nome.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $erros['email'] = 'Digite um e-mail válido.';
    if (mb_strlen($mensagem) < 10) $erros['mensagem'] = 'Conte um pouco mais (mínimo 10 caracteres).';
    if (!$erros) $enviado = true; // projeto de demonstração: não envia e-mail de verdade
}
$tituloPagina = 'Contato';
require_once __DIR__ . '/includes/header.php';
?>

<div class="grid g2" style="align-items:start">
  <div>
    <h1 style="font-size:clamp(22px,3vw,30px);margin:0 0 12px">Fale com a Y3D</h1>
    <p style="color:var(--mute);max-width:44ch">Dúvidas sobre um pedido, orçamento para um modelo personalizado ou impressão 3D? Envie sua mensagem.</p>
    <ul style="margin-top:22px;display:grid;gap:10px;color:var(--mute);font-size:14px">
      <li>✉️ suporte@y3dcreations.com</li>
      <li>📞 +55 44 9963-8985</li>
    </ul>
    <a class="btn-whats" href="<?= htmlspecialchars(WHATSAPP_URL) ?>" target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Y3D no WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>
      Chamar no WhatsApp
    </a>
  </div>

  <div class="card-panel">
    <?php if ($enviado): ?>
      <div class="alert">Mensagem enviada! Obrigado pelo contato.</div>
    <?php endif; ?>
    <form method="post" novalidate>
      <div class="fld">
        <label for="nome">Nome</label>
        <input id="nome" name="nome" value="<?= htmlspecialchars($_POST['nome'] ?? '') ?>">
        <?php if (!empty($erros['nome'])): ?><small style="color:#ff6b6b"><?= $erros['nome'] ?></small><?php endif; ?>
      </div>
      <div class="fld">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
        <?php if (!empty($erros['email'])): ?><small style="color:#ff6b6b"><?= $erros['email'] ?></small><?php endif; ?>
      </div>
      <div class="fld">
        <label for="mensagem">Mensagem</label>
        <textarea id="mensagem" name="mensagem" rows="5" style="width:100%;border-radius:10px;border:1px solid var(--line);background:var(--raise);color:var(--text);padding:12px"><?= htmlspecialchars($_POST['mensagem'] ?? '') ?></textarea>
        <?php if (!empty($erros['mensagem'])): ?><small style="color:#ff6b6b"><?= $erros['mensagem'] ?></small><?php endif; ?>
      </div>
      <button type="submit" class="btn btn-grad btn-block">Enviar mensagem</button>
    </form>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
