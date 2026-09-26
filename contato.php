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
      <li>📞 (11) 98765-4321</li>
    </ul>
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
