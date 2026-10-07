<?php
declare(strict_types=1);

/**
 * Configuração do login com Google.
 *
 * Como obter o Client ID (gratuito):
 *  1. Acesse https://console.cloud.google.com/apis/credentials
 *  2. Crie um projeto (ou use um existente) e clique em "Criar credenciais" → "ID do cliente OAuth".
 *  3. Tipo do aplicativo: "Aplicativo da Web".
 *  4. Em "Origens JavaScript autorizadas", adicione o endereço que você usa no navegador,
 *     por exemplo: http://localhost
 *  5. Copie o "Client ID" gerado (termina com .apps.googleusercontent.com) e cole abaixo.
 *
 * Nunca coloque o Client ID direto num arquivo versionado em produção; aqui ele fica
 * em includes/config.local.php, que está no .gitignore.
 */

const GOOGLE_CLIENT_ID_PADRAO = '';

$configLocal = __DIR__ . '/config.local.php';
if (is_file($configLocal)) {
    require $configLocal;   // pode definir GOOGLE_CLIENT_ID
}
if (!defined('GOOGLE_CLIENT_ID')) {
    define('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID_PADRAO);
}

/** Link da loja no Instagram: usado no ícone do rodapé. */
const INSTAGRAM_URL = 'https://www.instagram.com/y3d.creations';

/** WhatsApp da loja: número com DDI+DDD (só dígitos) e o link já pronto para o botão de contato. */
const WHATSAPP_NUMERO = '554499638985'; // +55 44 9963-8985
const WHATSAPP_URL = 'https://wa.me/' . WHATSAPP_NUMERO . '?text=' . 'Ol%C3%A1!%20Vim%20pelo%20site%20da%20Y3D%20Creations%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.';
