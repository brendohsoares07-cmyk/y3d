<?php
require_once __DIR__ . '/includes/funcoes.php';
require_once __DIR__ . '/includes/email.php';
if (y3d_usuario()) {
    header('Location: conta.php');
    exit;
}

$erro = null;
$sucesso = false;
$acao = (string) ($_GET['acao'] ?? $_POST['acao'] ?? '');
$token = trim((string) ($_POST['token'] ?? $_GET['token'] ?? ''));
$contaToken = $acao === 'redefinir' ? y3d_conta_por_token_senha($token) : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!y3d_csrf_valido($_POST['csrf'] ?? null)) {
        $erro = 'Sessão expirada. Recarregue a página e tente de novo.';
    } elseif ($acao === 'recuperar') {
        $email = trim((string) ($_POST['email'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $erro = 'Digite um e-mail válido.';
        } elseif (y3d_email_smtp_status() === 'biblioteca_ausente') {
            $erro = 'O serviço de e-mail não foi instalado neste servidor. Execute composer install e tente novamente.';
        } elseif (y3d_email_smtp_status() !== 'pronto') {
            $erro = 'O envio ainda não está configurado. Preencha Y3D_SMTP_USER e Y3D_SMTP_PASSWORD no arquivo .env com uma senha de app do Gmail e reinicie o Apache.';
        } elseif (($baseUrl = y3d_url_base_publica()) === null) {
            $erro = 'O endereço público da loja não está configurado corretamente. Entre em contato com o suporte da Y3D.';
        } else {
            $conta = y3d_conta_por_email($email);
            if ($conta !== null) {
                $tokenRecuperacao = y3d_token_senha_criar($email);
                if ($tokenRecuperacao !== null) {
                    $link = $baseUrl . '/login.php?acao=redefinir&token=' . rawurlencode($tokenRecuperacao);
                    $mensagem = "Olá, {$conta['nome']}!\n\n"
                        . "Recebemos um pedido para redefinir a senha da sua conta na Y3D Creations.\n"
                        . "Use o link abaixo em até uma hora:\n\n{$link}\n\n"
                        . "Se você não pediu a redefinição, ignore este e-mail.\n";
                    if (!y3d_email_enviar(
                        (string) $conta['email'],
                        (string) $conta['nome'],
                        'Redefinição de senha · Y3D Creations',
                        $mensagem
                    )) {
                        error_log('O e-mail de recuperação não foi aceito pelo servidor SMTP.');
                    }
                } else {
                    error_log('Não foi possível gerar o token de recuperação de senha.');
                }
            }
            $sucesso = true;
        }
    } elseif ($acao === 'redefinir') {
        $senha = (string) ($_POST['senha'] ?? '');
        $confirmacao = (string) ($_POST['confirma'] ?? '');

        if ($contaToken === null) {
            $erro = 'Este link é inválido ou expirou. Solicite uma nova redefinição.';
        } elseif (mb_strlen($senha) < 6) {
            $erro = 'A senha deve ter pelo menos 6 caracteres.';
        } elseif ($senha !== $confirmacao) {
            $erro = 'A confirmação da senha não é igual à senha.';
        } elseif (y3d_senha_redefinir_com_token($token, $senha)) {
            $sucesso = true;
            $contaToken = null;
        } else {
            $erro = 'Não foi possível redefinir a senha. Solicite um novo link e tente novamente.';
            $contaToken = null;
        }
    } else {
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
<link rel="icon" type="image/png" href="assets/img/logo-y3d-transparente.png">
<link rel="apple-touch-icon" href="assets/img/logo-y3d-transparente.png">
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
      <?php if ($acao === 'recuperar'): ?>
        <div class="lg-brand">
          <div class="lg-logo"><img src="assets/img/logo-y3d-transparente.png" alt="Y3D Creations"></div>
          <small>IDEIAS GANHAM FORMA</small>
        </div>
        <h1>Recuperar <span>senha</span></h1>
        <p class="lg-sub">Informe o e-mail da sua conta. Se ele estiver cadastrado e o serviço de envio estiver disponível, enviaremos um link válido por uma hora.</p>
        <?php if ($erro): ?><div class="lg-alert" role="alert"><?= e($erro) ?></div><?php endif; ?>
        <?php if ($sucesso): ?>
          <div class="lg-alert" role="status" style="border-color:#3ddbf2;background:rgba(61,219,242,.1);color:#d8faff">
            Se houver uma conta com esse e-mail, enviaremos as instruções. Verifique também a caixa de spam.
          </div>
        <?php else: ?>
          <form action="login.php?acao=recuperar" method="post" novalidate>
            <input type="hidden" name="acao" value="recuperar">
            <?= y3d_csrf_campo() ?>
            <div class="lg-input">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
              <input type="email" name="email" placeholder="Digite seu e-mail" autocomplete="email" aria-label="E-mail" value="<?= e($_POST['email'] ?? '') ?>" required>
            </div>
            <button type="submit" class="lg-btn">Enviar link de recuperação</button>
          </form>
        <?php endif; ?>
        <p class="lg-signup"><a href="login.php">Voltar para o login</a></p>
      <?php elseif ($acao === 'redefinir'): ?>
        <div class="lg-brand">
          <div class="lg-logo"><img src="assets/img/logo-y3d-transparente.png" alt="Y3D Creations"></div>
          <small>IDEIAS GANHAM FORMA</small>
        </div>
        <h1>Nova <span>senha</span></h1>
        <p class="lg-sub">Escolha uma nova senha com pelo menos 6 caracteres.</p>
        <?php if ($erro): ?><div class="lg-alert" role="alert"><?= e($erro) ?></div><?php endif; ?>
        <?php if ($sucesso): ?>
          <div class="lg-alert" role="status" style="border-color:#3ddbf2;background:rgba(61,219,242,.1);color:#d8faff">
            Senha alterada com sucesso. Você já pode entrar com a nova senha.
          </div>
          <p class="lg-signup"><a href="login.php">Ir para o login</a></p>
        <?php elseif ($contaToken !== null): ?>
          <form action="login.php?acao=redefinir" method="post" novalidate>
            <input type="hidden" name="acao" value="redefinir">
            <input type="hidden" name="token" value="<?= e($token) ?>">
            <?= y3d_csrf_campo() ?>
            <div class="lg-input">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
              <input type="password" name="senha" placeholder="Nova senha (mín. 6 caracteres)" autocomplete="new-password" aria-label="Nova senha" minlength="6" required>
            </div>
            <div class="lg-input">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
              <input type="password" name="confirma" placeholder="Confirme a nova senha" autocomplete="new-password" aria-label="Confirmar nova senha" minlength="6" required>
            </div>
            <button type="submit" class="lg-btn">Salvar nova senha</button>
          </form>
        <?php else: ?>
          <?php if (!$erro): ?><div class="lg-alert" role="alert">Este link é inválido ou expirou. Solicite uma nova redefinição.</div><?php endif; ?>
          <p class="lg-signup"><a href="login.php?acao=recuperar">Solicitar novo link</a></p>
        <?php endif; ?>
      <?php else: ?>
        <?php require __DIR__ . '/includes/form_login.php'; ?>
      <?php endif; ?>
    </div>
  </section>
</div>
<div id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/main.js"></script>
</body>
</html>
