<?php
require_once __DIR__ . '/includes/funcoes.php';
if (y3d_usuario()) {
    header('Location: conta.php');
    exit;
}

$erro = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $senha = (string) ($_POST['senha'] ?? '');

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erro = 'Digite um e-mail válido.';
    } elseif (mb_strlen($senha) < 6) {
        $erro = 'A senha deve ter pelo menos 6 caracteres.';
    } else {
        $conta = y3d_conta_por_email($email);
        // mesma mensagem para e-mail inexistente e senha errada (não revela quais e-mails existem)
        if (!$conta || !y3d_verificar_senha($conta, $senha)) {
            $erro = 'E-mail ou senha incorretos.';
        } else {
            y3d_entrar($conta, true);
            $_SESSION['flash'] = 'Login realizado com sucesso!';
            header('Location: ' . (y3d_eh_admin() ? 'admin.php' : 'conta.php'));
            exit;
        }
    }
}
$lgPrefix = 'lg';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Entrar · Y3D Creations</title>
<link rel="stylesheet" href="assets/css/style.css">
<link rel="icon" type="image/png" href="assets/img/logo-y3d.png">
<link rel="apple-touch-icon" href="assets/img/logo-y3d.png">
</head>
<body>
<div class="lg-page">
  <section class="lg-art" aria-label="Oficina Y3D com impressora 3D e peças impressas">
    <a href="index.php" class="lg-back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
      Voltar à loja
    </a>
    <?php require __DIR__ . '/includes/login_arte.php'; ?>
  </section>

  <section class="lg-side">
    <div class="lg-card">
      <?php require __DIR__ . '/includes/form_login.php'; ?>
    </div>
  </section>
</div>
<div id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/main.js"></script>
</body>
</html>
