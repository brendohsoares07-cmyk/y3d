<?php
$idsPersonagensPromo = [26, 27, 28, 29];
$personagensPromo = array_values(array_filter(array_map('y3d_produto_por_id', $idsPersonagensPromo)));
$comboPersonagens = y3d_produto_por_id(30);
if (count($personagensPromo) !== count($idsPersonagensPromo) || !$comboPersonagens) return;
$precoSeparado = array_sum(array_column($personagensPromo, 'preco'));
$economia = $precoSeparado - $comboPersonagens['preco'];
$descontoPercentual = (int) round(($economia / $precoSeparado) * 100);
?>
<section class="sec" id="promo-personagens">
  <div class="personagens-promo">
    <header class="personagens-promo-head">
      <span class="personagens-promo-selo">OFERTA IMPERDÍVEL</span>
      <p class="personagens-promo-chamada">4 personagens. Um combo de respeito.</p>
      <h2>Sua coleção completa por <span class="grad"><?= y3d_formatar_preco($comboPersonagens['preco']) ?></span></h2>
      <p class="personagens-promo-sub">Coiote, Frajola, Harry Potter e Bowser: leve os quatro e economize <?= y3d_formatar_preco($economia) ?>!</p>
    </header>

    <div class="personagens-promo-lista">
      <?php foreach ($personagensPromo as $personagem): ?>
        <a class="personagens-promo-item" href="produto.php?id=<?= $personagem['id'] ?>">
          <span class="personagens-promo-foto"><img src="<?= e($personagem['imagem']) ?>" alt="" loading="lazy"></span>
          <span class="personagens-promo-nome"><?= e($personagem['nome']) ?></span>
          <span class="personagens-promo-preco"><?= y3d_formatar_preco($personagem['preco']) ?></span>
        </a>
      <?php endforeach; ?>
    </div>

    <div class="personagens-promo-oferta">
      <div class="personagens-promo-economia">
        <span class="personagens-promo-tag"><?= $descontoPercentual ?>% OFF NO COMBO</span>
        <span class="personagens-promo-valores"><s><?= y3d_formatar_preco($precoSeparado) ?></s><strong><?= y3d_formatar_preco($comboPersonagens['preco']) ?></strong></span>
        <span class="personagens-promo-economize">Você economiza <?= y3d_formatar_preco($economia) ?></span>
      </div>
      <form action="handlers/carrinho.php" method="post">
        <input type="hidden" name="acao" value="comprar_agora">
        <input type="hidden" name="id" value="<?= $comboPersonagens['id'] ?>">
        <input type="hidden" name="quantidade" value="1">
        <button type="submit" class="btn btn-grad personagens-promo-botao">🛒 GARANTIR MEU COMBO →</button>
      </form>
    </div>
  </div>
</section>
