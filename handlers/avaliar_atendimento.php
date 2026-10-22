<?php
// Recebe a avaliação do atendimento (estrelas) enviada na tela de pedido concluído.
// Responde JSON quando chamado pelo JavaScript e redireciona de volta quando é um envio normal do formulário.
require_once __DIR__ . '/../includes/funcoes.php';

$querJson = ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch';

function y3d_responder_avaliacao(bool $json, bool $ok, string $mensagem): void
{
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'mensagem' => $mensagem], JSON_UNESCAPED_UNICODE);
    } else {
        if (!$ok) {
            $_SESSION['flash'] = $mensagem;
        }
        header('Location: ../checkout.php' . ($ok ? '?avaliado=1' : ''));
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    y3d_responder_avaliacao($querJson, false, 'Envie a avaliação pelo formulário.');
}

$pedidoId = (int) ($_POST['pedido'] ?? 0);
$nota = (int) ($_POST['nota'] ?? 0);
$comentario = trim((string) ($_POST['comentario'] ?? ''));

if (!y3d_csrf_valido($_POST['csrf'] ?? null)) {
    y3d_responder_avaliacao($querJson, false, 'Sessão expirada. Recarregue a página e tente de novo.');
}
// só dá para avaliar o pedido que acabou de ser feito nesta sessão
if ($pedidoId <= 0 || $pedidoId !== (int) ($_SESSION['pedido_para_avaliar'] ?? 0)) {
    y3d_responder_avaliacao($querJson, false, 'Não encontramos o pedido para avaliar.');
}
if ($nota < 1 || $nota > 5) {
    y3d_responder_avaliacao($querJson, false, 'Toque em uma estrela para avaliar.');
}
if (mb_strlen($comentario) > 600) {
    y3d_responder_avaliacao($querJson, false, 'O comentário pode ter até 600 caracteres.');
}
if (!y3d_pedido_avaliar($pedidoId, $nota, $comentario)) {
    y3d_responder_avaliacao($querJson, false, 'Não foi possível salvar agora. Tente de novo em instantes.');
}

unset($_SESSION['pedido_para_avaliar']);
y3d_responder_avaliacao($querJson, true, 'Obrigado pela sua avaliação!');
