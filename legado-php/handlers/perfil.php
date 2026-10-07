<?php
// Recebe a edição do perfil (trocar nome e trocar foto) vinda da página "Minha conta".
require_once __DIR__ . '/../includes/funcoes.php';

$usuario = y3d_usuario();
if (!$usuario || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../login.php');
    exit;
}

const Y3D_AVATAR_PASTA = __DIR__ . '/../assets/img/avatares';
const Y3D_AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

function y3d_perfil_voltar(string $mensagem): never
{
    $_SESSION['flash'] = $mensagem;
    header('Location: ../conta.php');
    exit;
}

$acao = $_POST['acao'] ?? '';

if ($acao === 'nome') {
    $nome = trim(preg_replace('/\s+/', ' ', (string) ($_POST['nome'] ?? '')));
    $tamanho = mb_strlen($nome);
    if ($tamanho < 2 || $tamanho > 80) {
        y3d_perfil_voltar('O nome precisa ter entre 2 e 80 caracteres.');
    }
    $conta = y3d_conta_atualizar($usuario['id'], ['nome' => $nome]);
    if ($conta) {
        $_SESSION['usuario']['nome'] = $conta['nome'];
        y3d_perfil_voltar('Nome atualizado com sucesso!');
    }
    y3d_perfil_voltar('Não foi possível atualizar o nome.');
}

if ($acao === 'foto') {
    $arquivo = $_FILES['foto'] ?? null;
    if (!$arquivo || $arquivo['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($arquivo['tmp_name'])) {
        y3d_perfil_voltar('Escolha uma imagem para enviar.');
    }
    if ($arquivo['size'] > Y3D_AVATAR_MAX_BYTES) {
        y3d_perfil_voltar('A foto é grande demais (máximo 2 MB).');
    }
    $info = @getimagesize($arquivo['tmp_name']);
    $extensoes = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
    if (!$info || !isset($extensoes[$info[2]])) {
        y3d_perfil_voltar('Formato inválido. Envie uma foto JPG, PNG ou WEBP.');
    }

    if (!is_dir(Y3D_AVATAR_PASTA)) {
        mkdir(Y3D_AVATAR_PASTA, 0775, true);
    }
    $nomeArquivo = 'usuario-' . $usuario['id'] . '-' . time() . '.' . $extensoes[$info[2]];
    if (!move_uploaded_file($arquivo['tmp_name'], Y3D_AVATAR_PASTA . '/' . $nomeArquivo)) {
        y3d_perfil_voltar('Não foi possível salvar a foto. Tente novamente.');
    }

    // apaga a foto anterior se ela também foi enviada por upload
    $anterior = (string) ($usuario['foto'] ?? '');
    if (str_starts_with($anterior, 'avatares/')) {
        @unlink(Y3D_AVATAR_PASTA . '/' . basename($anterior));
    }

    $conta = y3d_conta_atualizar($usuario['id'], ['foto' => 'avatares/' . $nomeArquivo]);
    if ($conta) {
        $_SESSION['usuario']['foto'] = $conta['foto'];
        y3d_perfil_voltar('Foto atualizada com sucesso!');
    }
    y3d_perfil_voltar('Não foi possível atualizar a foto.');
}

y3d_perfil_voltar('Ação inválida.');
