<?php
declare(strict_types=1);

/**
 * Pasta dos arquivos JSON (contas, pedidos, mensagens, avaliações).
 * Em produção ela deve ficar FORA da pasta pública do servidor: informe o caminho na
 * variável de ambiente Y3D_DATA_DIR (o docker-compose já faz isso). Sem a variável,
 * usa ./data (só para desenvolvimento local, protegida pelo data/.htaccess).
 */
function y3d_carregar_config_email(?string $arquivo = null): void
{
    $arquivo = $arquivo ?? dirname(__DIR__) . '/.env';
    if (!is_file($arquivo) || !is_readable($arquivo)) {
        return;
    }

    $permitidas = [
        'Y3D_BASE_URL',
        'Y3D_EMAIL_FROM',
        'Y3D_SMTP_HOST',
        'Y3D_SMTP_PORT',
        'Y3D_SMTP_ENCRYPTION',
        'Y3D_SMTP_USER',
        'Y3D_SMTP_PASSWORD',
    ];
    $linhas = file($arquivo, FILE_IGNORE_NEW_LINES);
    if ($linhas === false) {
        error_log('Não foi possível ler o arquivo de configuração de e-mail.');
        return;
    }

    foreach ($linhas as $linha) {
        if (preg_match('/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/', $linha, $partes) !== 1) {
            continue;
        }
        $chave = $partes[1];
        if (!in_array($chave, $permitidas, true)) {
            continue;
        }

        $atual = getenv($chave);
        if ($atual !== false && $atual !== '') {
            continue;
        }

        $valor = $partes[2];
        if (strlen($valor) >= 2 && $valor[0] === $valor[strlen($valor) - 1] && ($valor[0] === '"' || $valor[0] === "'")) {
            $valor = substr($valor, 1, -1);
        } else {
            $valor = preg_replace('/\s+#.*$/', '', $valor) ?? $valor;
            $valor = trim($valor);
        }

        putenv($chave . '=' . $valor);
        $_ENV[$chave] = $valor;
        $_SERVER[$chave] = $valor;
    }
}

y3d_carregar_config_email();

define('Y3D_PASTA_DADOS', rtrim((string) (getenv('Y3D_DATA_DIR') ?: __DIR__ . '/../data'), '/\\'));

function y3d_url_base_publica(): ?string
{
    $configurada = trim((string) getenv('Y3D_BASE_URL'));
    if ($configurada !== '') {
        $partes = parse_url($configurada);
        if (
            $partes === false
            || !in_array($partes['scheme'] ?? '', ['http', 'https'], true)
            || empty($partes['host'])
            || isset($partes['user'])
            || isset($partes['pass'])
            || isset($partes['query'])
            || isset($partes['fragment'])
        ) {
            return null;
        }
        return rtrim($configurada, '/');
    }

    $host = (string) ($_SERVER['HTTP_HOST'] ?? '');
    if (preg_match('/\A[a-zA-Z0-9.-]+(?::\d{1,5})?\z/', $host) !== 1) {
        return null;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
    $diretorio = trim(str_replace('\\', '/', dirname((string) ($_SERVER['SCRIPT_NAME'] ?? '/'))), '/.');
    $prefixo = trim((string) ($_SERVER['HTTP_X_FORWARDED_PREFIX'] ?? ''), '/');
    if ($prefixo !== '' && preg_match('#\A[a-zA-Z0-9._/-]+\z#', $prefixo) !== 1) {
        return null;
    }
    $caminho = implode('/', array_filter([$prefixo, $diretorio], static fn (string $parte): bool => $parte !== ''));
    return ($https ? 'https://' : 'http://') . $host . ($caminho !== '' ? '/' . $caminho : '');
}

/** Link da loja no Instagram: usado no ícone do rodapé. */
const INSTAGRAM_URL = 'https://www.instagram.com/y3d.creations';

/** Canal da Y3D no YouTube: usado no ícone do rodapé. Troque pelo link do seu canal (ex.: https://www.youtube.com/@seucanal). */
const YOUTUBE_URL = 'https://www.youtube.com/';

/** WhatsApp da loja: número com DDI+DDD (só dígitos) e o link já pronto para o botão de contato. */
const WHATSAPP_NUMERO = '554499638985'; // +55 44 9963-8985
const WHATSAPP_URL = 'https://wa.me/' . WHATSAPP_NUMERO . '?text=' . 'Ol%C3%A1!%20Vim%20pelo%20site%20da%20Y3D%20Creations%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.';
