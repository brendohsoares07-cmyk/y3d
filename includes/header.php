<?php
require_once __DIR__ . '/funcoes.php';
$paginaAtual = basename($_SERVER['SCRIPT_NAME']);
$totalCarrinho = y3d_total_itens_carrinho();
$usuarioLogado = y3d_usuario();
$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= isset($tituloPagina) ? htmlspecialchars($tituloPagina) . ' · ' : '' ?>Y3D Creations</title>
<link rel="stylesheet" href="assets/css/style.css">
<link rel="icon" type="image/png" href="assets/img/produtos/estatua-harry-potter.png">
<link rel="apple-touch-icon" href="assets/img/produtos/estatua-harry-potter.png">
</head>
<body>
<header class="hdr">
  <div class="hdr-in">
    <a href="index.php" class="logo"><img src="assets/img/produtos/estatua-harry-potter.png" class="logo-ic" alt="Y3D Creations"></a>
    <nav class="hdr-nav">
      <a href="index.php" class="<?= $paginaAtual === 'index.php' ? 'on' : '' ?>">Início</a>
      <a href="produtos.php" class="<?= $paginaAtual === 'produtos.php' ? 'on' : '' ?>">Produtos</a>
      <a href="produtos.php?categoria=personagens">Modelos 3D</a>
      <a href="sobre.php" class="<?= $paginaAtual === 'sobre.php' ? 'on' : '' ?>">Sobre</a>
      <a href="contato.php" class="<?= $paginaAtual === 'contato.php' ? 'on' : '' ?>">Contato</a>
    </nav>
    <form class="hdr-search" action="produtos.php" method="get">
      <span>🔍</span>
      <input type="search" name="busca" placeholder="Buscar produtos, modelos ou categorias..." value="<?= htmlspecialchars($_GET['busca'] ?? '') ?>">
    </form>
    <div class="hdr-icons">
      <a href="<?= htmlspecialchars(INSTAGRAM_URL) ?>" class="ibtn ibtn-instagram" title="Instagram da Y3D Creations" aria-label="Instagram da Y3D Creations" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/></svg>
      </a>
      <a href="<?= $usuarioLogado ? 'conta.php' : 'login.php' ?>" class="ibtn" title="Minha conta">👤</a>
      <button type="button" class="ibtn" id="btn-favoritos" title="Favoritos">♡</button>
      <a href="carrinho.php" class="ibtn" title="Carrinho">
        🛒<?php if ($totalCarrinho > 0): ?><span class="n"><?= $totalCarrinho ?></span><?php endif; ?>
      </a>
      <?php if ($usuarioLogado): ?>
      <a href="conta.php" class="ava" title="<?= htmlspecialchars($usuarioLogado['nome']) ?>"><?= htmlspecialchars(y3d_iniciais($usuarioLogado['nome'])) ?></a>
      <?php else: ?>
      <a href="login.php" class="btn btn-grad btn-sm" style="margin-left:6px">Entrar</a>
      <?php endif; ?>
    </div>
  </div>
</header>
<main class="wrap" style="padding-top:24px;padding-bottom:40px">
<?php if ($flash): ?>
  <div class="alert"><?= htmlspecialchars($flash) ?></div>
<?php endif; ?>
