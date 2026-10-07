<?php
// Promoção da Coleção BT21: carrossel com um personagem por vez + faixa da coleção completa.
// Os produtos vêm de includes/dados_produtos.php (ids 18 a 24 = personagens, 25 = coleção completa).
$idsBt21 = [18, 19, 20, 21, 22, 23, 24];
$personagensBt21 = array_values(array_filter(array_map('y3d_produto_por_id', $idsBt21)));
$colecaoBt21 = y3d_produto_por_id(25);
if (!$personagensBt21) return;
?>
<section class="sec" id="promo-bt21">
  <div class="bt21" data-bt21>
    <div class="bt21-head">
      <span class="bt21-tag">BT21</span>
      <div>
        <h2>Coleção BT21 em <span class="grad">promoção</span></h2>
        <p class="bt21-sub">Escolha seu personagem favorito</p>
      </div>
      <span class="bt21-line" aria-hidden="true"></span>
    </div>

    <div class="bt21-carrossel">
      <button type="button" class="bt21-seta bt21-seta-esq" data-bt21-anterior aria-label="Personagem anterior">←</button>

      <div class="bt21-pista" data-bt21-pista tabindex="0" aria-label="Personagens BT21 em promoção">
        <?php foreach ($personagensBt21 as $p):
          $nomeCurto = trim(str_replace('BT21', '', $p['nome'])); ?>
          <article class="bt21-card" data-bt21-card data-nome="<?= e($nomeCurto) ?>">
            <a href="produto.php?id=<?= $p['id'] ?>" class="bt21-palco" style="--c1:<?= e($p['cor1']) ?>;--c2:<?= e($p['cor2']) ?>">
              <span class="bt21-selo">BT21</span>
              <img src="<?= e($p['imagem']) ?>" alt="<?= e($nomeCurto) ?> BT21" loading="lazy">
            </a>
            <div class="bt21-info">
              <a href="produto.php?id=<?= $p['id'] ?>"><h3><?= e($nomeCurto) ?></h3></a>
              <span class="bt21-traco" aria-hidden="true"></span>
              <div class="bt21-preco-row">
                <span class="bt21-preco"><small>R$</small> <?= number_format($p['preco'], 2, ',', '.') ?></span>
                <form action="handlers/carrinho.php" method="post">
                  <input type="hidden" name="acao" value="adicionar">
                  <input type="hidden" name="id" value="<?= $p['id'] ?>">
                  <input type="hidden" name="quantidade" value="1">
                  <input type="hidden" name="voltar" value="<?= e(basename($_SERVER['SCRIPT_NAME'])) ?>">
                  <button type="submit" class="cart-add" aria-label="Adicionar <?= e($nomeCurto) ?> ao carrinho">🛒</button>
                </form>
              </div>
            </div>
          </article>
        <?php endforeach; ?>
      </div>

      <button type="button" class="bt21-seta bt21-seta-dir" data-bt21-proximo aria-label="Próximo personagem">→</button>
    </div>

    <div class="bt21-pontos" data-bt21-pontos></div>
  </div>

  <?php if ($colecaoBt21): ?>
  <div class="bt21-combo">
    <span class="bt21-tag">BT21</span>
    <img class="bt21-combo-img" src="<?= e($colecaoBt21['imagem']) ?>" alt="Coleção completa BT21" loading="lazy">
    <div class="bt21-combo-copy">
      <span class="lg-eyebrow bt21-eyebrow">COLEÇÃO COMPLETA <i>///</i></span>
      <p>10 personagens por <b class="grad"><?= y3d_formatar_preco($colecaoBt21['preco']) ?></b></p>
    </div>
    <form action="handlers/carrinho.php" method="post">
      <input type="hidden" name="acao" value="comprar_agora">
      <input type="hidden" name="id" value="<?= $colecaoBt21['id'] ?>">
      <input type="hidden" name="quantidade" value="1">
      <button type="submit" class="btn btn-grad bt21-comprar">🛒 COMPRAR AGORA →</button>
    </form>
  </div>
  <?php endif; ?>
</section>
