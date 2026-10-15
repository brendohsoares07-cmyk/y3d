<?php
$tituloPagina = 'Finalizar compra';
require_once __DIR__ . '/includes/funcoes.php';
$pedidoConcluido = false;
$cepInformado = trim($_POST['cep'] ?? '');

$formaPagamento = $_POST['pagamento'] ?? '';
$totalPedido = 0.0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && y3d_total_itens_carrinho() > 0) {
    $totalPedido = y3d_total_carrinho(); // valor final (preço normal dos produtos), calculado no servidor antes de esvaziar o carrinho
    y3d_limpar_carrinho();
    $pedidoConcluido = true;
}

require_once __DIR__ . '/includes/header.php';
$itens = y3d_itens_carrinho();
$subtotal = y3d_subtotal_carrinho();
$total = y3d_total_carrinho();
?>

<?php if ($pedidoConcluido && $formaPagamento === 'pix' && $totalPedido > 0): ?>
  <div class="checkout-success pix-box" data-pix-valor="<?= number_format($totalPedido, 2, '.', '') ?>">
    <h1>Pedido recebido! Falta só o Pix</h1>
    <p>Abra o app do seu banco, escolha <b>Pix → Ler QR Code</b> e confirme o pagamento de <b class="pix-valor"><?= y3d_formatar_preco($totalPedido) ?></b>.</p>
    <div class="pix-qr" data-pix-qr aria-live="polite"></div>
    <p class="pix-ou">Ou use o Pix copia e cola:</p>
    <textarea class="pix-codigo" data-pix-codigo readonly rows="4" aria-label="Código Pix copia e cola"></textarea>
    <button type="button" class="btn btn-outline" data-pix-copiar>Copiar código Pix</button>
    <p class="pix-aviso">O valor já vem preenchido, não precisa digitar nada. Guarde o comprovante: ele confirma o seu pedido.</p>
    <a href="produtos.php" class="btn btn-grad">Continuar comprando</a>
  </div>
  <script src="assets/js/pix.js"></script>
<?php elseif ($pedidoConcluido): ?>
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
          <label><input type="radio" name="pagamento" value="pix" required> Pix <small>Pagamento imediato · QR Code ao finalizar</small></label>
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
        <?php foreach ($itens as $item): $produtoItem = $item['produto']; $imagemCheckout = y3d_imagem_principal($produtoItem); ?>
          <div class="checkout-item">
            <div class="checkout-item-image">
              <?php if ($imagemCheckout !== ''): ?><img src="<?= htmlspecialchars($imagemCheckout) ?>" alt=""><?php else: ?><?= $produtoItem['emoji'] ?><?php endif; ?>
            </div>
            <div><b><?= htmlspecialchars($produtoItem['nome']) ?></b><small><?= $item['quantidade'] ?> unidade<?= $item['quantidade'] === 1 ? '' : 's' ?></small></div>
            <strong><?= y3d_formatar_preco($item['subtotal']) ?></strong>
          </div>
        <?php endforeach; ?>
      </div>
      <div class="checkout-total-row"><span>Subtotal</span><strong data-checkout-subtotal="<?= $subtotal ?>"><?= y3d_formatar_preco($subtotal) ?></strong></div>
      <div class="checkout-total-row checkout-grand-total"><span>Total</span><strong data-checkout-total="<?= $total ?>"><?= y3d_formatar_preco($total) ?></strong></div>
      <a href="carrinho.php" class="checkout-back">← Voltar ao carrinho</a>
    </aside>
  </div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
