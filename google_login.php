<?php
declare(strict_types=1);

/**
 * Recebe o token (JWT) que o Google manda depois que a pessoa escolhe a conta
 * Google dela, confirma com o próprio Google que o token é válido, e só deixa
 * entrar quem já tem conta cadastrada na Y3D Creations com o mesmo e-mail.
 * Não cria conta nova por aqui — só faz login em conta que já existe.
 */
require_once __DIR__ . '/includes/funcoes.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.php');
    exit;
}

if (!defined('GOOGLE_CLIENT_ID') || GOOGLE_CLIENT_ID === '') {
    header('Location: login.php?erro=sem_configuracao');
    exit;
}

$credential = (string) ($_POST['credential'] ?? '');
if ($credential === '') {
    header('Location: login.php?erro=token_invalido');
    exit;
}

/**
 * Confirma o token direto com o Google (endpoint público de verificação).
 * Ele checa a assinatura, a validade e devolve os dados do perfil.
 */
function y3d_verificar_token_google(string $token): ?array
{
    $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode($token);

    $resposta = false;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 8,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $resposta = curl_exec($ch);
        $codigoHttp = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($resposta === false || $codigoHttp !== 200) {
            return null;
        }
    } else {
        $contexto = stream_context_create(['http' => ['timeout' => 8]]);
        $resposta = @file_get_contents($url, false, $contexto);
        if ($resposta === false) {
            return null;
        }
    }

    $payload = json_decode((string) $resposta, true);
    return is_array($payload) ? $payload : null;
}

$payload = y3d_verificar_token_google($credential);

// aud precisa bater com o Client ID do site, e o e-mail precisa estar confirmado pelo Google
if (
    $payload === null
    || ($payload['aud'] ?? '') !== GOOGLE_CLIENT_ID
    || ($payload['email_verified'] ?? 'false') !== 'true'
    || empty($payload['email'])
) {
    header('Location: login.php?erro=token_invalido');
    exit;
}

$email = (string) $payload['email'];
$conta = y3d_conta_por_email($email);

if ($conta === null) {
    // Regra pedida: se a conta não existir na Y3D, o login com Google não é permitido.
    header('Location: login.php?erro=nao_cadastrado');
    exit;
}

$googleId = (string) ($payload['sub'] ?? '');
$nome     = isset($payload['name']) ? (string) $payload['name'] : null;
$foto     = isset($payload['picture']) ? (string) $payload['picture'] : null;

$conta = y3d_conta_vincular_google($conta, $googleId, $nome, $foto);
y3d_entrar($conta);

$_SESSION['flash'] = 'Login com o Google realizado. Bem-vindo(a) de volta!';
header('Location: conta.php');
exit;
