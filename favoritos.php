<?php
// Favoritos são guardados só no navegador (localStorage), não no servidor — por isso a página
// renderiza todos os produtos já escondidos, e o main.js mostra apenas os que estão favoritados.
$tituloPagina = 'Favoritos';
require_once __DIR__ . '/includes/dados_produtos.php';
require_once __DIR__ . '/includes/header.php';
?>

<div class="sec-h">
  <h2>Meus favoritos</h2>
  <span class="more" id="favoritos-contagem"></span>
</div>

<div class="grid g4" id="favoritos-grid">
  <?php foreach ($PRODUTOS as $p): ?>
    <div class="fav-wrap" data-produto-id="<?= $p['id'] ?>" hidden>
      <?php include __DIR__ . '/includes/card_produto.php'; ?>
    </div>
  <?php endforeach; ?>
</div>

<div class="card-panel" id="favoritos-vazio" style="text-align:center;color:var(--mute)">
  <p>Você ainda não tem produtos favoritos.</p>
  <p class="muted" style="font-size:13px">Clique no coração ♡ de um produto para guardá-lo aqui.</p>
  <a href="produtos.php" class="btn btn-outline btn-sm" style="margin-top:10px">Ver produtos</a>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
