<?php
$tituloPagina = 'Carrinho';
require_once __DIR__ . '/includes/header.php';
$itens = y3d_itens_carrinho();
?>

<div class="sec-h"><h2 style="font-size:20px">🛒 Meu Carrinho (<?= y3d_total_itens_carrinho() ?>)</h2></div>

<?php if (!$itens): ?>
  <div class="card-panel" style="text-align:center;color:var(--mute);padding:50px 20px">
    <p style="font-size:40px;margin-bottom:10px">🛒</p>
    <p>Seu carrinho está vazio.</p>
    <a href="produtos.php" class="btn btn-grad" style="margin-top:14px">Ver produtos</a>
  </div>
<?php else: ?>
  <div class="grid" style="grid-template-columns:1fr 340px;gap:24px;align-items:start">
    <div class="card-panel">
      <?php foreach ($itens as $item): $p = $item['produto']; ?>
        <div class="item">
          <div class="ic" style="background:linear-gradient(135deg,<?= $p['cor1'] ?>33,<?= $p['cor2'] ?>33)"><?= $p['emoji'] ?></div>
          <div class="info">
            <b><?= htmlspecialchars($p['nome']) ?></b>
            <div style="color:var(--mute)"><?= y3d_formatar_preco($p['preco']) ?> cada</div>
            <form action="handlers/carrinho.php" method="post" style="display:flex;align-items:center;gap:10px;margin-top:6px">
              <input type="hidden" name="acao" value="atualizar">
              <input type="hidden" name="id" value="<?= $p['id'] ?>">
              <input type="hidden" name="voltar" value="carrinho.php">
              <span class="qty">
                <button type="submit" name="quantidade" value="<?= $item['quantidade'] - 1 ?>">−</button>
                <span><?= $item['quantidade'] ?></span>
                <button type="submit" name="quantidade" value="<?= $item['quantidade'] + 1 ?>">+</button>
              </span>
              <b><?= y3d_formatar_preco($item['subtotal']) ?></b>
            </form>
          </div>
          <form action="handlers/carrinho.php" method="post">
            <input type="hidden" name="acao" value="remover">
            <input type="hidden" name="id" value="<?= $p['id'] ?>">
            <input type="hidden" name="voltar" value="carrinho.php">
            <button type="submit" class="rm" aria-label="Remover <?= htmlspecialchars($p['nome']) ?>">✕</button>
          </form>
        </div>
      <?php endforeach; ?>
    </div>

    <div class="card-panel cart-panel">
      <h3 style="margin:0 0 10px;font-size:15px">Resumo do pedido</h3>
      <div class="sum-row"><span>Subtotal</span><span><?= y3d_formatar_preco(y3d_subtotal_carrinho()) ?></span></div>
      <?php $freteCarrinho = y3d_frete_carrinho(); ?>
      <div class="sum-row"><span>Frete</span><span><?= $freteCarrinho === null ? 'Calcular no checkout' : ($freteCarrinho > 0 ? y3d_formatar_preco($freteCarrinho) : 'Grátis') ?></span></div>
      <div class="sum-row total"><span>Total</span><span><?= y3d_formatar_preco(y3d_total_carrinho()) ?></span></div>
      <a href="checkout.php" class="btn btn-grad btn-block" style="margin-top:16px">Finalizar compra →</a>
      <form action="handlers/carrinho.php" method="post" style="margin-top:8px">
        <input type="hidden" name="acao" value="limpar">
        <input type="hidden" name="voltar" value="carrinho.php">
        <button type="submit" class="btn btn-outline btn-block">Esvaziar carrinho</button>
      </form>
    </div>
  </div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
