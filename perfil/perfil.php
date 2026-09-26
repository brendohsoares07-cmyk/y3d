<?php
require_once __DIR__ . '/../includes/funcoes.php';

$usuario = y3d_usuario();
if (!$usuario) {
    header('Location: ../login.php');
    exit;
}

$loginEm = date('d/m/Y \à\s H:i', (int) ($usuario['login_em'] ?? time()));
$senhaMascarada = str_repeat('•', max(6, min(20, (int) ($usuario['senha_tamanho'] ?? 6))));
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Minha conta | Y3D Creations</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<?php require_once __DIR__ . '/../includes/header.php'; ?>

<main class="wrap">
  <div class="crumbs"><a href="../index.php">Início</a> / Minha conta</div>

  <section class="acc">
    <aside class="acc-side card-panel">
      <div class="acc-avatar"><?= htmlspecialchars(y3d_iniciais($usuario['nome'])) ?></div>
      <h1><?= htmlspecialchars($usuario['nome']) ?></h1>
      <p class="acc-mail"><?= htmlspecialchars($usuario['email']) ?></p>
      <span class="acc-badge"><i></i> Conectado</span>
      <div class="acc-actions">
        <a href="../produtos.php" class="btn btn-grad btn-block">Continuar comprando</a>
        <a href="../carrinho.php" class="btn btn-outline btn-block">Ver carrinho</a>
        <a href="../logout.php" class="btn btn-outline btn-block acc-out">Sair da conta</a>
      </div>
    </aside>

    <div class="acc-main card-panel">
      <div class="sec-h"><h2>Dados da conta</h2></div>
      <dl class="acc-list">
        <div class="acc-item">
          <span class="acc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"/></svg></span>
          <div><dt>Nome</dt><dd><?= htmlspecialchars($usuario['nome']) ?></dd></div>
        </div>
        <div class="acc-item">
          <span class="acc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7.5l8 6 8-6"/></svg></span>
          <div><dt>E-mail</dt><dd><?= htmlspecialchars($usuario['email']) ?></dd></div>
        </div>
        <div class="acc-item">
          <span class="acc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>
          <div><dt>Senha</dt><dd class="acc-pass"><?= $senhaMascarada ?></dd></div>
        </div>
        <div class="acc-item">
          <span class="acc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg></span>
          <div><dt>Login realizado em</dt><dd><?= $loginEm ?></dd></div>
        </div>
      </dl>
      <p class="acc-note">Por segurança, a senha aparece mascarada: sites de verdade nunca guardam nem mostram a senha original, só uma versão criptografada.</p>
    </div>
  </section>
</main>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>