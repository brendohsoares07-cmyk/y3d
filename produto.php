<?php
require_once __DIR__ . '/includes/funcoes.php';
require_once __DIR__ . '/includes/dados_produtos.php';
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$produto = y3d_produto_por_id($id);
if (!$produto) {
    header('Location: produtos.php');
    exit;
}
// Avaliação enviada por um cliente logado (uma por produto: avaliar de novo substitui a anterior)
$contaLogada = y3d_usuario();
$erroAvaliacao = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['acao'] ?? '') === 'avaliar') {
    $nota = (int) ($_POST['nota'] ?? 0);
    $comentario = trim((string) ($_POST['comentario'] ?? ''));
    if (!$contaLogada) {
        $erroAvaliacao = 'Entre na sua conta para avaliar este produto.';
    } elseif (!y3d_csrf_valido($_POST['csrf'] ?? null)) {
        $erroAvaliacao = 'Sessão expirada. Recarregue a página e tente de novo.';
    } elseif ($nota < 1 || $nota > 5) {
        $erroAvaliacao = 'Escolha de 1 a 5 estrelas.';
    } elseif (mb_strlen($comentario) > 600) {
        $erroAvaliacao = 'O comentário pode ter até 600 caracteres.';
    } elseif (!y3d_avaliacao_salvar($id, (int) $contaLogada['id'], (string) $contaLogada['nome'], $nota, $comentario)) {
        $erroAvaliacao = 'Não foi possível salvar agora. Tente de novo em instantes.';
    } else {
        header('Location: produto.php?id=' . $id . '&avaliado=1#avaliacoes');
        exit;
    }
}
$tituloPagina = $produto['nome'];
require_once __DIR__ . '/includes/header.php';
$categoria = $CATEGORIAS[$produto['categoria']]['nome'];
$imagensProduto = y3d_imagens_do_produto($produto);
$imagemProduto = y3d_imagem_principal($produto);
$imagensGaleria = array_slice($imagensProduto, 0, 5); // só fotos do próprio produto (originais em alta resolução)
?>

<div class="pdp-crumbs">
  <a href="index.php">Início</a> / <a href="produtos.php?categoria=<?= e($produto['categoria']) ?>"><?= e($categoria) ?></a> / <?= e($produto['nome']) ?>
</div>

<div class="product-detail-shell">
  <section class="product-gallery<?= count($imagensGaleria) < 2 ? ' no-thumbs' : '' ?>" aria-label="Galeria de imagens" data-gallery data-gallery-nome="<?= e($produto['nome']) ?>" data-gallery-images="<?= e(json_encode($imagensGaleria, JSON_UNESCAPED_SLASHES)) ?>">
    <?php if (count($imagensGaleria) > 1): ?>
      <div class="product-gallery-thumbs" data-gallery-thumbs>
        <?php foreach ($imagensGaleria as $indice => $imagem): ?>
          <button type="button" class="product-gallery-thumb<?= $indice === 0 ? ' is-active' : '' ?>" data-gallery-thumb="<?= $indice ?>" aria-label="Ver foto <?= $indice + 1 ?> de <?= count($imagensGaleria) ?>"<?= $indice === 0 ? ' aria-current="true"' : '' ?>>
            <img src="<?= e(y3d_miniatura($imagem)) ?>" alt="" loading="lazy" decoding="async">
          </button>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
    <?php if ($imagemProduto !== ''): ?>
      <button type="button" class="product-gallery-main" data-gallery-open aria-label="Ampliar imagem de <?= e($produto['nome']) ?>">
        <img src="<?= e($imagemProduto) ?>" alt="<?= e($produto['nome']) ?>" data-gallery-main decoding="async">
      </button>
    <?php else: ?>
      <div class="product-gallery-main"><span class="product-gallery-emoji"><?= $produto['emoji'] ?></span></div>
    <?php endif; ?>
  </section>

  <section class="product-buy-panel">
    <div class="product-tags"><span><?= e($categoria) ?></span><span><?= e($produto['formatos'][0]) ?></span></div>
    <h1><?= e($produto['nome']) ?></h1>
    <?php if ($produto['num_avaliacoes'] > 0): ?>
    <div class="product-rating"><span><?= y3d_estrelas_html($produto['avaliacao']) ?></span> <?= e($produto['avaliacao']) ?> (<?= e($produto['num_avaliacoes']) ?> avaliações)</div>
    <?php endif; ?>
    <p class="product-price"><?= y3d_formatar_preco($produto['preco']) ?></p>
    <p class="product-description"><?= e($produto['descricao']) ?></p>

    <p class="product-option-label">Formatos e detalhes:</p>
    <div class="product-format-list">
      <?php foreach ($produto['formatos'] as $formato): ?><span><?= e($formato) ?></span><?php endforeach; ?>
      <span><?= e($produto['tamanho']) ?></span>
    </div>

    <form action="handlers/carrinho.php" method="post" class="product-buy-form">
      <input type="hidden" name="acao" value="adicionar">
      <input type="hidden" name="id" value="<?= $produto['id'] ?>">
      <input type="hidden" name="voltar" value="produto.php?id=<?= $produto['id'] ?>">
      <span class="qty-box">
        <button type="button" data-qty-menos aria-label="Diminuir quantidade">−</button>
        <span data-qty-valor>1</span>
        <button type="button" data-qty-mais aria-label="Aumentar quantidade">+</button>
      </span>
      <input type="hidden" name="quantidade" data-qty-input value="1">
      <button type="submit" class="btn btn-grad">🛒 Adicionar ao carrinho</button>
    </form>
    <form action="handlers/carrinho.php" method="post" class="product-buy-now-form">
      <input type="hidden" name="acao" value="comprar_agora">
      <input type="hidden" name="id" value="<?= $produto['id'] ?>">
      <input type="hidden" name="quantidade" data-buy-now-quantity value="1">
      <input type="hidden" name="voltar" value="produto.php?id=<?= $produto['id'] ?>">
      <button type="submit" class="btn btn-outline btn-block">Comprar agora</button>
    </form>
    <button type="button" class="product-favorite" data-fav="<?= $produto['id'] ?>" aria-pressed="false">♡ Adicionar aos favoritos</button>
  </section>

  <aside class="product-benefits">
    <div><strong>▣</strong><span><b>Envio rápido</b><small>em até 5 dias, para todo o Brasil</small></span></div>
    <div><strong>♡</strong><span><b>Compra segura</b><small>Seus dados protegidos</small></span></div>
    <div><strong>✓</strong><span><b>Diversas formas de pagamento</b><small>Pix, cartão e boleto</small></span></div>
    <details open>
      <summary>Descrição completa</summary>
      <ul>
        <li>Material e acabamento de qualidade</li>
        <li>Categoria: <?= e($categoria) ?></li>
        <li>Produto conferido antes do envio</li>
      </ul>
    </details>
  </aside>
</div>

<?php $avaliacoes = y3d_avaliacoes_do_produto($id); ?>
<section class="sec" id="avaliacoes">
  <div class="sec-h"><h2>Avaliações dos clientes</h2></div>
  <div class="grid g2" style="align-items:start">
    <div class="card-panel">
      <?php if (!$avaliacoes): ?>
        <p style="color:var(--mute)">Este produto ainda não tem avaliações. Seja o primeiro a avaliar!</p>
      <?php else: ?>
        <?php foreach ($avaliacoes as $av): ?>
          <div style="padding:12px 0;border-bottom:1px solid var(--line)">
            <div><strong><?= e($av['nome']) ?></strong> <span style="color:#ffc83d"><?= y3d_estrelas_html((float) $av['nota']) ?></span>
              <small style="color:var(--mute);margin-left:6px"><?= e(date('d/m/Y', (int) $av['criado_em'])) ?></small></div>
            <?php if (trim((string) ($av['comentario'] ?? '')) !== ''): ?>
              <p style="margin:6px 0 0;color:var(--mute);font-size:14px"><?= nl2br(e($av['comentario'])) ?></p>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
    <div class="card-panel">
      <h3 style="margin:0 0 12px;font-size:16px">Deixe sua avaliação</h3>
      <?php if (isset($_GET['avaliado'])): ?><div class="alert">Obrigado! Sua avaliação foi publicada.</div><?php endif; ?>
      <?php if ($erroAvaliacao): ?><div class="alert" style="border-color:#ff6b6b"><?= e($erroAvaliacao) ?></div><?php endif; ?>
      <?php if ($contaLogada): ?>
        <form method="post" action="produto.php?id=<?= (int) $id ?>#avaliacoes">
          <input type="hidden" name="acao" value="avaliar">
          <input type="hidden" name="csrf" value="<?= e(y3d_csrf_token()) ?>">
          <div class="fld">
            <label for="nota">Nota</label>
            <select id="nota" name="nota" style="width:100%;border-radius:10px;border:1px solid var(--line);background:var(--raise);color:var(--text);padding:11px">
              <option value="5">★★★★★ — Excelente</option>
              <option value="4">★★★★☆ — Muito bom</option>
              <option value="3">★★★☆☆ — Bom</option>
              <option value="2">★★☆☆☆ — Regular</option>
              <option value="1">★☆☆☆☆ — Ruim</option>
            </select>
          </div>
          <div class="fld">
            <label for="comentario">Comentário (opcional)</label>
            <textarea id="comentario" name="comentario" rows="4" maxlength="600" style="width:100%;border-radius:10px;border:1px solid var(--line);background:var(--raise);color:var(--text);padding:12px"></textarea>
          </div>
          <button type="submit" class="btn btn-grad btn-block">Enviar avaliação</button>
        </form>
      <?php else: ?>
        <p style="color:var(--mute)">Para avaliar, <a href="login.php" style="color:var(--violet)">entre na sua conta</a> ou <a href="cadastro.php" style="color:var(--violet)">cadastre-se</a>.</p>
      <?php endif; ?>
    </div>
  </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
