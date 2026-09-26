<?php
// Conteúdo do cartão de login (usado em login.php e na home).
// Variáveis esperadas: $lgPrefix (string p/ ids únicos) e, opcionalmente, $erro.
$lgPrefix = $lgPrefix ?? 'lg';
$erro = $erro ?? null;
?>
<div class="lg-brand">
  <div class="lg-logo"><img src="assets/img/logo-icon.svg" alt=""><b>Y3D</b></div>
  <small>IDEIAS GANHAM FORMA</small>
</div>

<h1>Faça seu <span>login</span></h1>
<p class="lg-sub">Acesse sua conta e continue explorando nossos produtos 3D.</p>

<?php if ($erro): ?><div class="lg-alert" role="alert"><?= htmlspecialchars($erro) ?></div><?php endif; ?>

<form action="login.php" method="post" novalidate>
  <div class="lg-input">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"/></svg>
    <input type="email" id="<?= $lgPrefix ?>-email" name="email" placeholder="Digite seu e-mail" autocomplete="email" aria-label="E-mail" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>
  </div>

  <div class="lg-input">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/></svg>
    <input type="password" id="<?= $lgPrefix ?>-senha" name="senha" placeholder="Digite sua senha" autocomplete="current-password" aria-label="Senha" required>
    <button type="button" class="lg-eye" data-toggle-senha="<?= $lgPrefix ?>-senha" aria-pressed="false" aria-label="Mostrar senha">
      <svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
      <svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
    </button>
  </div>

  <div class="lg-row">
    <label class="lg-chk">
      <input type="checkbox" name="lembrar" checked>
      <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i>
      Lembrar de mim
    </label>
    <a href="#" class="lg-link">Esqueceu sua senha?</a>
  </div>

  <button type="submit" class="lg-btn">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>
    Entrar
  </button>
</form>

<div class="lg-or">ou</div>

<button type="button" class="lg-google" data-login-google>
  <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
  Entrar com o Google
</button>

<p class="lg-signup">Não tem uma conta? <a href="#">Cadastre-se</a></p>
