<?php
require_once __DIR__ . '/../includes/funcoes.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function y3d_asaas_responder_webhook(int $status, array $resposta): void
{
    http_response_code($status);
    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    y3d_asaas_responder_webhook(405, ['erro' => 'Método não permitido.']);
}

$tokenConfigurado = trim((string) getenv('Y3D_ASAAS_WEBHOOK_TOKEN'));
$tokenRecebido = (string) ($_SERVER['HTTP_ASAAS_ACCESS_TOKEN'] ?? '');
if ($tokenConfigurado === '') {
    error_log('Asaas webhook: token não configurado.');
    y3d_asaas_responder_webhook(503, ['erro' => 'Webhook não configurado.']);
}
if ($tokenRecebido === '' || !hash_equals($tokenConfigurado, $tokenRecebido)) {
    y3d_asaas_responder_webhook(401, ['erro' => 'Não autorizado.']);
}

$corpo = file_get_contents('php://input');
$evento = is_string($corpo) ? json_decode($corpo, true) : null;
if (!is_array($evento) || !is_string($evento['event'] ?? null)) {
    y3d_asaas_responder_webhook(400, ['erro' => 'Evento inválido.']);
}
if ($evento['event'] !== 'PAYMENT_RECEIVED') {
    y3d_asaas_responder_webhook(200, ['recebido' => true]);
}

$pagamento = $evento['payment'] ?? null;
if (
    !is_array($pagamento)
    || ($pagamento['status'] ?? '') !== 'RECEIVED'
    || ($pagamento['billingType'] ?? '') !== 'PIX'
) {
    error_log('Asaas webhook: evento de recebimento com dados de pagamento inválidos.');
    y3d_asaas_responder_webhook(200, ['recebido' => true]);
}

$referencia = $pagamento['externalReference'] ?? null;
$paymentId = $pagamento['id'] ?? null;
$valor = $pagamento['value'] ?? null;
if (
    !is_string($referencia)
    || !is_string($paymentId)
    || preg_match('/\Ay3d-order-(\d+)\z/', $referencia, $partes) !== 1
    || $paymentId === ''
    || !is_numeric($valor)
    || (float) $valor <= 0
) {
    error_log('Asaas webhook: referência ou valor da cobrança inválido.');
    y3d_asaas_responder_webhook(200, ['recebido' => true]);
}

$resultado = y3d_pedido_confirmar_asaas((int) $partes[1], $paymentId, (float) $valor);
if ($resultado === 'erro') {
    error_log('Asaas webhook: não foi possível salvar a confirmação do pedido.');
    y3d_asaas_responder_webhook(500, ['erro' => 'Não foi possível salvar a confirmação.']);
}
if ($resultado !== 'confirmado') {
    error_log('Asaas webhook: cobrança não corresponde ao pedido registrado.');
}
y3d_asaas_responder_webhook(200, ['recebido' => true]);
