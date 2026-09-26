<?php
// Conteúdo do cartão de cadastro (usado em cadastro.php).
// Variáveis esperadas: $lgPrefix, $erro, $nome, $email.
$lgPrefix = $lgPrefix ?? 'cad';
$erro  = $erro ?? null;
$nome  = $nome ?? '';
$email = $email ?? '';
?>
<div class="lg-brand">
  <div class="lg-logo"><img src="assets/img/logo-icon.svg" alt=""><b>Y3D</b></div>
  <small>IDEIAS GANHAM FORMA</small>
</div>

<h1>Crie sua <span>conta</span></h1>
<p class="lg-sub">Cadastre-se para comprar, favoritar produtos e acompanhar seus pedidos.</p>

<?php if ($erro): ?><div class="lg-alert" role="alert"><?= htmlspecialchars($erro) ?></div><?php endif; ?>

<form action="cadastro.php" method="post" novalidate>
  <div class="lg-input">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"/><circle cx="12" cy="8" r="4"/></svg>
    <input type="text" id="<?= $lgPrefix ?>-nome" name="nome" placeholder="Digite seu nome" autocomplete="name" aria-label="Nome" value="<?= htmlspecialchars($nome) ?>" required>
  </div>

  <div class="lg-input">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"/></svg>
    <input type="email" id="<?= $lgPrefix ?>-email" name="email" placeholder="Digite seu e-mail" autocomplete="email" aria-label="E-mail" value="<?= htmlspecialchars($email) ?>" required>
  </div>

  <div class="lg-input">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/></svg>
    <input type="password" id="<?= $lgPrefix ?>-senha" name="senha" placeholder="Crie uma senha (mín. 6 caracteres)" autocomplete="new-password" aria-label="Senha" minlength="6" required>
    <button type="button" class="lg-eye" data-toggle-senha="<?= $lgPrefix ?>-senha" aria-pressed="false" aria-label="Mostrar senha">
      <svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
      <svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
    </button>
  </div>

  <div class="lg-input">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/></svg>
    <input type="password" id="<?= $lgPrefix ?>-confirma" name="confirma" placeholder="Confirme sua senha" autocomplete="new-password" aria-label="Confirmar senha" minlength="6" required>
    <button type="button" class="lg-eye" data-toggle-senha="<?= $lgPrefix ?>-confirma" aria-pressed="false" aria-label="Mostrar senha">
      <svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
      <svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
    </button>
  </div>

  <button type="submit" class="lg-btn">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>
    Cadastrar
  </button>
</form>

<p class="lg-signup">Já tem uma conta? <a href="login.php">Entrar</a></p>
