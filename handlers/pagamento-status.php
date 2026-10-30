<?php
require_once __DIR__ . '/../includes/funcoes.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$pedidoIdTexto = is_string($_GET['id'] ?? null) ? $_GET['id'] : '';
$pedidosPix = $_SESSION['pedidos_pix_asaas'] ?? [];
if (
    preg_match('/\A[1-9]\d*\z/', $pedidoIdTexto) !== 1
    || !is_array($pedidosPix)
    || !isset($pedidosPix[$pedidoIdTexto])
) {
    http_response_code(404);
    echo json_encode(['erro' => 'Pedido não encontrado.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$pedido = y3d_pedido_por_id((int) $pedidoIdTexto);
if ($pedido === null || ($pedido['pagamento'] ?? '') !== 'pix') {
    http_response_code(404);
    echo json_encode(['erro' => 'Pedido não encontrado.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$status = !empty($pedido['pagamento_confirmado_em'])
    ? 'pago'
    : (($pedido['status'] ?? '') === 'cancelado' ? 'cancelado' : 'aguardando');
echo json_encode(['status' => $status], JSON_UNESCAPED_UNICODE);
