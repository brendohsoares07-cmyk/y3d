<?php
// Recebe as ações do carrinho vindas dos formulários (POST) e redireciona de volta.
require_once __DIR__ . '/../includes/funcoes.php';

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
$voltar = $_POST['voltar'] ?? 'produtos.php';
header('Location: ../' . $voltar);
exit;
