<?php
require_once __DIR__ . '/includes/funcoes.php';
$u = y3d_usuario();
if (!$u) {
    header('Location: login.php');
    exit;
}
$tituloPagina = 'Minha conta';
$loginEm = date('d/m/Y', $u['login_em']) . ' às ' . date('H:i', $u['login_em']);
$senhaMascarada = !empty($u['google_id']) ? 'Login pelo Google (sem senha na Y3D)' : str_repeat('•', 10);
require_once __DIR__ . '/includes/header.php';
?>

<div class="crumbs"><a href="index.php">Início</a> / Minha conta</div>

<section class="acc">
  <aside class="acc-side card-panel">
    <div class="acc-avatar">
      <?php if (!empty($u['foto'])): ?>
        <img src="<?= e(foto_url($u['foto'])) ?>" alt="Foto de <?= e($u['nome']) ?>" referrerpolicy="no-referrer">
      <?php else: ?>
        <?= htmlspecialchars(y3d_iniciais($u['nome'])) ?>
      <?php endif; ?>
    </div>
    <form action="handlers/perfil.php" method="post" enctype="multipart/form-data" class="acc-photo-form">
      <input type="hidden" name="acao" value="foto">
      <input type="file" name="foto" id="acc-foto" accept="image/jpeg,image/png,image/webp" hidden onchange="this.form.submit()">
      <label for="acc-foto" class="btn btn-outline btn-sm acc-photo-btn">📷 Trocar foto</label>
    </form>
    <h1><?= htmlspecialchars($u['nome']) ?></h1>
    <details class="acc-edit">
      <summary class="btn btn-outline btn-sm">✏️ Editar nome</summary>
      <form action="handlers/perfil.php" method="post" class="acc-edit-form">
        <input type="hidden" name="acao" value="nome">
        <input type="text" name="nome" value="<?= e($u['nome']) ?>" minlength="2" maxlength="80" required aria-label="Novo nome">
        <button type="submit" class="btn btn-grad btn-sm">Salvar</button>
      </form>
    </details>
    <p class="acc-mail"><?= htmlspecialchars($u['email']) ?></p>
    <span class="acc-badge"><i></i> Conectado</span>
    <div class="acc-actions">
      <a href="produtos.php" class="btn btn-grad btn-block">Continuar comprando</a>
      <a href="carrinho.php" class="btn btn-outline btn-block">Ver carrinho</a>
      <a href="logout.php" class="btn btn-outline btn-block acc-out">Sair da conta</a>
    </div>
  </aside>

  <div class="acc-main card-panel">
    <div class="sec-h"><h2>Dados da conta</h2></div>
    <dl class="acc-list">
      <div class="acc-item">
        <span class="acc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"/></svg></span>
        <div><dt>Nome</dt><dd><?= htmlspecialchars($u['nome']) ?></dd></div>
      </div>
      <div class="acc-item">
        <span class="acc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7.5l8 6 8-6"/></svg></span>
        <div><dt>E-mail</dt><dd><?= htmlspecialchars($u['email']) ?></dd></div>
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

<?php require_once __DIR__ . '/includes/footer.php'; ?>
