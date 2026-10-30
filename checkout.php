<?php
$tituloPagina = 'Finalizar compra';
require_once __DIR__ . '/includes/funcoes.php';
require_once __DIR__ . '/includes/validacoes.php';
require_once __DIR__ . '/includes/asaas.php';
$pedidoConcluido = false;
$pagamentoConfirmado = false;
$pedidoPixDados = null;
$pedidoIdExibido = 0;
$nomeInformado = trim((string) ($_POST['nome'] ?? ''));
$telefoneInformado = trim((string) ($_POST['telefone'] ?? ''));
$cepInformado = trim($_POST['cep'] ?? '');
$cpfInformado = trim($_POST['cpf'] ?? '');
$erroCheckout = null;

$formaPagamento = trim((string) ($_POST['pagamento'] ?? ''));
$totalPedido = 0.0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && y3d_total_itens_carrinho() > 0) {
    // CPF obrigatório e válido: sem isso o pedido não é concluído e o carrinho é mantido
    if (!y3d_csrf_valido($_POST['csrf'] ?? null)) {
        $erroCheckout = 'Sessão expirada. Recarregue a página e tente de novo.';
    } elseif ($formaPagamento !== 'pix') {
        $erroCheckout = 'No momento, aceitamos somente pagamento por Pix.';
    } elseif ($nomeInformado === '') {
        $erroCheckout = 'Informe seu nome completo.';
    } elseif (!in_array(strlen(y3d_somente_digitos($telefoneInformado)), [10, 11], true)) {
        $erroCheckout = 'Informe um telefone com DDD.';
    } elseif (y3d_somente_digitos($cpfInformado) === '') {
        $erroCheckout = 'Informe o CPF para finalizar o pedido.';
    } elseif (!y3d_cpf_valido($cpfInformado)) {
        $erroCheckout = 'CPF inválido. Confira os números e tente de novo.';
    }
    if ($erroCheckout === null) {
        $erroCheckout = y3d_asaas_configuracao_erro();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && y3d_total_itens_carrinho() > 0 && $erroCheckout === null) {
    $totalPedido = y3d_total_carrinho(); // valor final (preço normal dos produtos), calculado no servidor antes de esvaziar o carrinho

    // guarda o pedido (data/pedidos.json) para aparecer no painel admin
    $itensDoPedido = [];
    foreach (y3d_itens_carrinho() as $item) {
        $itensDoPedido[] = [
            'id'         => (int) $item['produto']['id'],
            'nome'       => (string) $item['produto']['nome'],
            'quantidade' => (int) $item['quantidade'],
            'preco'      => (float) $item['produto']['preco'],
        ];
    }
    $contaLogada = y3d_usuario();
    $dadosPedido = [
        'usuario_id' => $contaLogada ? (int) $contaLogada['id'] : null,
        'nome'       => $nomeInformado,
        'email'      => $contaLogada ? (string) $contaLogada['email'] : '',
        'telefone'   => $telefoneInformado,
        'cpf'        => y3d_somente_digitos($cpfInformado),
        'cep'        => $cepInformado,
        'endereco'   => trim($_POST['endereco'] ?? ''),
        'bairro'     => trim($_POST['bairro'] ?? ''),
        'cidade'     => trim($_POST['cidade'] ?? ''),
        'pagamento'  => (string) $formaPagamento,
        'itens'      => $itensDoPedido,
        'total'      => $totalPedido,
    ];
    $pedidoId = y3d_pedido_registrar($dadosPedido);
    if ($pedidoId > 0) {
        $pedidoPixDados = y3d_asaas_criar_pix($pedidoId, $dadosPedido);
        if (
            $pedidoPixDados === null
            || !y3d_pedido_vincular_asaas($pedidoId, $pedidoPixDados['payment_id'])
        ) {
            y3d_pedido_mudar_status($pedidoId, 'cancelado');
            $erroCheckout = 'Não foi possível gerar a cobrança Pix. Seu carrinho foi mantido. Verifique a configuração e os logs do serviço de pagamento.';
        } else {
            $_SESSION['pedido_pix_asaas_id'] = $pedidoId;
            $pedidosPix = $_SESSION['pedidos_pix_asaas'] ?? [];
            if (!is_array($pedidosPix)) {
                $pedidosPix = [];
            }
            $pedidosPix[$pedidoId] = true;
            $_SESSION['pedidos_pix_asaas'] = array_slice($pedidosPix, -10, null, true);
            $_SESSION['pedido_pix_asaas_dados'] = $pedidoPixDados;
            $_SESSION['pedido_para_avaliar'] = $pedidoId;
            y3d_limpar_carrinho();
            header('Location: checkout.php?pagamento=aguardando', true, 303);
            exit;
        }
    } else {
        $erroCheckout = 'Não foi possível registrar o pedido agora. Seu carrinho foi mantido, tente de novo.';
    }
}

if (
    $_SERVER['REQUEST_METHOD'] === 'GET'
    && ($_GET['pagamento'] ?? '') === 'aguardando'
) {
    $pedidoIdExibido = (int) ($_SESSION['pedido_pix_asaas_id'] ?? 0);
    $pedido = $pedidoIdExibido > 0 ? y3d_pedido_por_id($pedidoIdExibido) : null;
    $dadosPixSessao = $_SESSION['pedido_pix_asaas_dados'] ?? null;
    if (
        $pedido !== null
        && ($pedido['pagamento'] ?? '') === 'pix'
        && is_array($dadosPixSessao)
        && ($pedido['asaas_payment_id'] ?? '') === ($dadosPixSessao['payment_id'] ?? null)
        && is_string($dadosPixSessao['imagem'] ?? null)
        && is_string($dadosPixSessao['payload'] ?? null)
    ) {
        $pedidoConcluido = true;
        $formaPagamento = 'pix';
        $totalPedido = (float) ($pedido['total'] ?? 0);
        $pedidoPixDados = $dadosPixSessao;
        $pagamentoConfirmado = !empty($pedido['pagamento_confirmado_em']);
    }
}

require_once __DIR__ . '/includes/header.php';
$itens = y3d_itens_carrinho();
$subtotal = y3d_subtotal_carrinho();
$total = y3d_total_carrinho();
?>

<?php if ($pedidoConcluido && $formaPagamento === 'pix' && $totalPedido > 0): ?>
  <div class="checkout-success pix-box" data-pix-valor="<?= number_format($totalPedido, 2, '.', '') ?>" data-pix-status-url="handlers/pagamento-status.php?id=<?= $pedidoIdExibido ?>" data-pix-pago-inicial="<?= $pagamentoConfirmado ? 'true' : 'false' ?>">
    <h1 data-pix-status role="status" aria-live="polite"><?= $pagamentoConfirmado ? 'Pagamento concluído!' : 'Pedido recebido! Aguardando pagamento' ?></h1>
    <div data-pix-pendente<?= $pagamentoConfirmado ? ' hidden' : '' ?>>
      <p>Abra o app do seu banco, escolha <b>Pix → Ler QR Code</b> e pague <b class="pix-valor"><?= y3d_formatar_preco($totalPedido) ?></b>.</p>
      <div class="pix-qr" data-pix-qr>
        <img src="data:image/png;base64,<?= htmlspecialchars((string) $pedidoPixDados['imagem']) ?>" alt="QR Code Pix da cobrança" style="width:100%;height:100%;display:block;object-fit:contain">
      </div>
      <p class="pix-ou">Ou use o Pix copia e cola:</p>
      <textarea class="pix-codigo" data-pix-codigo readonly rows="4" aria-label="Código Pix copia e cola"><?= htmlspecialchars((string) $pedidoPixDados['payload']) ?></textarea>
      <button type="button" class="btn btn-outline" data-pix-copiar>Copiar código Pix</button>
      <p class="pix-aviso">A confirmação aparece automaticamente quando o pagamento for recebido na conta.</p>
    </div>
    <div data-pix-pago<?= $pagamentoConfirmado ? '' : ' hidden' ?>>
      <p>O valor foi recebido e confirmado na conta. Seu pedido está pago.</p>
    </div>
    <p data-pix-erro role="status" aria-live="polite" hidden></p>
    <p data-pix-copia-status role="status" aria-live="polite"></p>
    <a href="produtos.php" class="btn btn-grad">Continuar comprando</a>
  </div>
  <?php require __DIR__ . '/includes/avaliar_atendimento.php'; ?>
  <script src="assets/js/pix.js"></script>
<?php elseif ($pedidoConcluido): ?>
  <div class="checkout-success">
    <span>✓</span>
    <h1>Pedido recebido!</h1>
    <p>Seu pedido foi registrado para demonstração. Em breve você receberá as instruções de pagamento e envio.</p>
    <a href="produtos.php" class="btn btn-grad">Continuar comprando</a>
  </div>
  <?php require __DIR__ . '/includes/avaliar_atendimento.php'; ?>
<?php elseif (!$itens && isset($_GET['avaliado'])): ?>
  <div class="checkout-success">
    <span>★</span>
    <h1>Obrigado pela sua avaliação!</h1>
    <p>A sua opinião ajuda a Y3D a atender cada vez melhor.</p>
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
    <form class="checkout-form" method="post" action="checkout.php" novalidate>
      <?= y3d_csrf_campo() ?>
      <?php if ($erroCheckout): ?><div class="checkout-erro" role="alert"><?= htmlspecialchars($erroCheckout) ?></div><?php endif; ?>
      <div class="checkout-section">
        <div class="checkout-heading"><span>1</span><h1>Endereço de entrega</h1></div>
        <div class="checkout-fields">
          <label>Nome completo<input type="text" name="nome" required placeholder="Seu nome completo" value="<?= htmlspecialchars(trim($_POST['nome'] ?? '')) ?>"></label>
          <label>Telefone<input type="tel" name="telefone" required placeholder="(00) 00000-0000" value="<?= htmlspecialchars(trim($_POST['telefone'] ?? '')) ?>"></label>
          <label>CPF<input id="checkout-cpf" type="text" name="cpf" required placeholder="000.000.000-00" inputmode="numeric" maxlength="14" autocomplete="off" data-cpf value="<?= htmlspecialchars(y3d_cpf_formatar($cpfInformado)) ?>"><small class="checkout-cpf-erro" data-cpf-erro role="alert" hidden></small></label>
          <label>CEP<input id="checkout-cep" type="text" name="cep" required placeholder="00000-000" inputmode="numeric" maxlength="9" autocomplete="postal-code" value="<?= htmlspecialchars($cepInformado) ?>"><small class="checkout-cep-status" data-cep-status role="status" hidden></small></label>
          <label class="field-wide">Endereço<input id="checkout-endereco" type="text" name="endereco" required placeholder="Rua, número e complemento" value="<?= htmlspecialchars(trim($_POST['endereco'] ?? '')) ?>"></label>
          <label>Bairro<input id="checkout-bairro" type="text" name="bairro" required placeholder="Seu bairro" value="<?= htmlspecialchars(trim($_POST['bairro'] ?? '')) ?>"></label>
          <label>Cidade<input id="checkout-cidade" type="text" name="cidade" required placeholder="Sua cidade" value="<?= htmlspecialchars(trim($_POST['cidade'] ?? '')) ?>"></label>
        </div>
      </div>
      <div class="checkout-section">
        <div class="checkout-heading"><span>2</span><h2>Forma de pagamento</h2></div>
        <div class="payment-options">
          <label><input type="radio" name="pagamento" value="pix" required> Pix <small>Confirmação automática após o recebimento</small></label>
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

<style>
.checkout-erro{border:1px solid #ff6b6b;background:rgba(255,107,107,.12);color:#ffd5d5;padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:16px}
.checkout-cpf-erro{color:#ff9c9c;font-size:11.5px}
.checkout-cpf-erro[hidden]{display:none}
.checkout-cep-status{color:#7fe0b0;font-size:11.5px}
.checkout-cep-status.is-erro{color:#ff9c9c}
.checkout-cep-status[hidden]{display:none}
.checkout-fields label.is-invalid input{border-color:#ff6b6b;box-shadow:0 0 0 3px rgba(255,107,107,.18)}
.checkout-fields label.is-valid input{border-color:#38d39f}
</style>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
