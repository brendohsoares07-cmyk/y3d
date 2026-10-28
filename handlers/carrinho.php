<?php
// Recebe as ações do carrinho vindas dos formulários (POST) e redireciona de volta.
require_once __DIR__ . '/../includes/funcoes.php';

/** Aceita só uma página da própria loja (ex.: "produto.php?id=3"), nunca outro site nem caminho solto. */
function y3d_destino_seguro(string $destino): string
{
    $partes = explode('?', $destino, 2);
    $pagina = basename($partes[0]);
    if (preg_match('/^[a-z0-9_-]+\.php$/i', $pagina) !== 1) {
        return 'produtos.php';
    }
    $consulta = $partes[1] ?? '';
    return preg_match('/^[A-Za-z0-9_=&%.\-]*$/', $consulta) === 1 && $consulta !== '' ? $pagina . '?' . $consulta : $pagina;
}

// só aceita ações enviadas pelos formulários da própria loja (token CSRF da sessão)
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !y3d_csrf_valido($_POST['csrf'] ?? null)) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $_SESSION['flash'] = 'Sessão expirada. Recarregue a página e tente de novo.';
    }
    header('Location: ../produtos.php');
    exit;
}

$acao = $_POST['acao'] ?? '';
$idProduto = isset($_POST['id']) ? (int) $_POST['id'] : 0;

switch ($acao) {
    case 'adicionar':
        $quantidade = isset($_POST['quantidade']) ? (int) $_POST['quantidade'] : 1;
        y3d_adicionar_ao_carrinho($idProduto, $quantidade);
        $_SESSION['flash'] = 'Produto adicionado ao carrinho!';
        break;

    case 'comprar_agora':
        $quantidade = isset($_POST['quantidade']) ? (int) $_POST['quantidade'] : 1;
        y3d_adicionar_ao_carrinho($idProduto, $quantidade);
        header('Location: ../checkout.php');
        exit;

    case 'atualizar':
        $quantidade = isset($_POST['quantidade']) ? (int) $_POST['quantidade'] : 1;
        y3d_atualizar_quantidade($idProduto, $quantidade);
        break;

    case 'remover':
        y3d_remover_do_carrinho($idProduto);
        $_SESSION['flash'] = 'Produto removido do carrinho.';
        break;

    case 'limpar':
        y3d_limpar_carrinho();
        break;
}

// Volta para a página de onde o formulário foi enviado, ou para a loja.
$voltar = y3d_destino_seguro((string) ($_POST['voltar'] ?? 'produtos.php'));
header('Location: ../' . $voltar);
exit;
