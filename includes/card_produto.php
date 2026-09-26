<article class="card" data-nome="<?= htmlspecialchars(mb_strtolower($p['nome'])) ?>" data-categoria="<?= $p['categoria'] ?>">
  <a href="produto.php?id=<?= $p['id'] ?>">
    <div class="thumb" style="background:linear-gradient(135deg,<?= $p['cor1'] ?>33,<?= $p['cor2'] ?>33)">
      <?php if (!empty($p['imagem'])): ?>
        <img src="<?= htmlspecialchars($p['imagem']) ?>" alt="<?= htmlspecialchars($p['nome']) ?>" loading="lazy">
      <?php else: ?>
        <?= $p['emoji'] ?>
      <?php endif; ?>
    </div>
  </a>
  <button type="button" class="fav-btn" data-fav="<?= $p['id'] ?>" aria-pressed="false" aria-label="Favoritar <?= htmlspecialchars($p['nome']) ?>">♡</button>
  <div class="card-body">
    <a href="produto.php?id=<?= $p['id'] ?>"><h3><?= htmlspecialchars($p['nome']) ?></h3></a>
    <div class="rate"><span class="st"><?= y3d_estrelas_html($p['avaliacao']) ?></span> <?= $p['avaliacao'] ?> (<?= $p['num_avaliacoes'] ?>)</div>
    <div class="price-row">
      <span class="price"><?= y3d_formatar_preco($p['preco']) ?></span>
      <form action="handlers/carrinho.php" method="post">
        <input type="hidden" name="acao" value="adicionar">
        <input type="hidden" name="id" value="<?= $p['id'] ?>">
        <input type="hidden" name="quantidade" value="1">
        <input type="hidden" name="voltar" value="<?= htmlspecialchars($_SERVER['REQUEST_URI']) ?>">
        <button type="submit" class="cart-add" aria-label="Adicionar <?= htmlspecialchars($p['nome']) ?> ao carrinho">🛒</button>
      </form>
    </div>
  </div>
</article>
