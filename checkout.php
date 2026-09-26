<?php
$tituloPagina = 'Finalizar compra';
require_once __DIR__ . '/includes/funcoes.php';
$pedidoConcluido = false;
$cepInformado = trim($_POST['cep'] ?? '');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && y3d_total_itens_carrinho() > 0) {
    y3d_limpar_carrinho();
    $pedidoConcluido = true;
}

require_once __DIR__ . '/includes/header.php';
$itens = y3d_itens_carrinho();
$subtotal = y3d_subtotal_carrinho();
$frete = y3d_frete_carrinho($cepInformado);
$total = y3d_total_carrinho($cepInformado);
?>

<?php if ($pedidoConcluido): ?>
  <div class="checkout-success">
    <span>✓</span>
    <h1>Pedido recebido!</h1>
    <p>Seu pedido foi registrado para demonstração. Em breve você receberá as instruções de pagamento e envio.</p>
    <a href="produtos.php" class="btn btn-grad">Continuar comprando</a>
  </div>
<?php elseif (!$itens): ?>
  <div class="checkout-empty">
    <h1>Seu carrinho está vazio</h1>
    <p>Adicione um produto antes de finalizar a compra.</p>
    <a href="produtos.php" class="btn btn-grad">Ver produtos</a>
  </div>
<?php else: ?>
  <div class="checkout-layout">
    <form class="checkout-form" method="post" action="checkout.php">
      <div class="checkout-section">
        <div class="checkout-heading"><span>1</span><h1>Endereço de entrega</h1></div>
        <div class="checkout-fields">
          <label>Nome completo<input type="text" name="nome" required placeholder="Seu nome completo"></label>
          <label>Telefone<input type="tel" name="telefone" required placeholder="(00) 00000-0000"></label>
          <label class="field-wide">Endereço<input type="text" name="endereco" required placeholder="Rua, número e complemento"></label>
          <label>Cidade<input type="text" name="cidade" required placeholder="Sua cidade"></label>
          <label>CEP<input id="checkout-cep" type="text" name="cep" required placeholder="00000-000" inputmode="numeric" maxlength="9" value="<?= htmlspecialchars($cepInformado) ?>"></label>
        </div>
      </div>
      <div class="checkout-section">
        <div class="checkout-heading"><span>2</span><h2>Forma de pagamento</h2></div>
        <div class="payment-options">
          <label><input type="radio" name="pagamento" value="pix" required> Pix <small>Pagamento imediato</small></label>
          <label><input type="radio" name="pagamento" value="cartao"> Cartão de crédito <small>Até 12x</small></label>
          <label><input type="radio" name="pagamento" value="boleto"> Boleto bancário <small>Vencimento em 3 dias</small></label>
        </div>
      </div>
      <button type="submit" class="btn btn-grad checkout-submit">Finalizar pedido</button>
      <small class="checkout-safe">🔒 Seus dados estão protegidos</small>
    </form>

    <aside class="checkout-summary">
      <div class="checkout-heading"><span>3</span><h2>Revisão do pedido</h2></div>
      <div class="checkout-items">
        <?php foreach ($itens as $item): $produtoItem = $item['produto']; ?>
          <div class="checkout-item">
            <div class="checkout-item-image">
              <?php if (!empty($produtoItem['imagem'])): ?><img src="<?= htmlspecialchars($produtoItem['imagem']) ?>" alt=""><?php else: ?><?= $produtoItem['emoji'] ?><?php endif; ?>
            </div>
            <div><b><?= htmlspecialchars($produtoItem['nome']) ?></b><small><?= $item['quantidade'] ?> unidade<?= $item['quantidade'] === 1 ? '' : 's' ?></small></div>
            <strong><?= y3d_formatar_preco($item['subtotal']) ?></strong>
          </div>
        <?php endforeach; ?>
      </div>
      <div class="checkout-total-row"><span>Subtotal</span><strong data-checkout-subtotal="<?= $subtotal ?>"><?= y3d_formatar_preco($subtotal) ?></strong></div>
      <div class="checkout-total-row"><span>Frete</span><strong data-checkout-freight><?= $frete === null ? 'Informe seu CEP' : ($frete > 0 ? y3d_formatar_preco($frete) : 'Grátis') ?></strong></div>
      <div class="checkout-total-row checkout-grand-total"><span>Total</span><strong data-checkout-total="<?= $total ?>"><?= y3d_formatar_preco($total) ?></strong></div>
      <a href="carrinho.php" class="checkout-back">← Voltar ao carrinho</a>
    </aside>
  </div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
