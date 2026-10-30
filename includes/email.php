<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

$autoload = dirname(__DIR__) . '/vendor/autoload.php';
if (is_file($autoload)) {
    require_once $autoload;
}

function y3d_email_smtp_configurado(): bool
{
    return y3d_email_smtp_status() === 'pronto';
}

function y3d_email_smtp_status(): string
{
    if (!class_exists(PHPMailer::class)) {
        return 'biblioteca_ausente';
    }

    $host = trim((string) getenv('Y3D_SMTP_HOST'));
    $usuario = trim((string) getenv('Y3D_SMTP_USER'));
    $senha = preg_replace('/\s+/', '', (string) getenv('Y3D_SMTP_PASSWORD')) ?? '';
    $remetente = trim((string) (getenv('Y3D_EMAIL_FROM') ?: $usuario));
    $porta = filter_var(getenv('Y3D_SMTP_PORT') ?: '587', FILTER_VALIDATE_INT);
    $criptografia = strtolower(trim((string) (getenv('Y3D_SMTP_ENCRYPTION') ?: 'tls')));

    return $host !== ''
        && $usuario !== ''
        && $senha !== ''
        && $porta !== false
        && $porta >= 1
        && $porta <= 65535
        && in_array($criptografia, ['tls', 'ssl'], true)
        && filter_var($usuario, FILTER_VALIDATE_EMAIL) !== false
        && filter_var($remetente, FILTER_VALIDATE_EMAIL) !== false
        ? 'pronto'
        : 'configuracao_ausente';
}

function y3d_email_enviar(
    string $destinatario,
    string $nome,
    string $assunto,
    string $mensagem,
    ?string $responderPara = null,
    ?string $nomeResponder = null
): bool
{
    if (!y3d_email_smtp_configurado()) {
        error_log('O SMTP da loja não está configurado para envio de e-mails.');
        return false;
    }
    if ($responderPara !== null && filter_var($responderPara, FILTER_VALIDATE_EMAIL) === false) {
        error_log('Endereço de resposta inválido para envio de e-mail.');
        return false;
    }

    try {
        $mailer = new PHPMailer(true);
        $mailer->isSMTP();
        $mailer->Host = trim((string) getenv('Y3D_SMTP_HOST'));
        $mailer->SMTPAuth = true;
        $mailer->Username = trim((string) getenv('Y3D_SMTP_USER'));
        $mailer->Password = preg_replace('/\s+/', '', (string) getenv('Y3D_SMTP_PASSWORD')) ?? '';
        $mailer->SMTPSecure = strtolower(trim((string) (getenv('Y3D_SMTP_ENCRYPTION') ?: 'tls'))) === 'ssl'
            ? PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer::ENCRYPTION_STARTTLS;
        $mailer->Port = (int) (getenv('Y3D_SMTP_PORT') ?: 587);
        $mailer->Timeout = 15;
        $mailer->SMTPDebug = SMTP::DEBUG_OFF;
        $mailer->CharSet = PHPMailer::CHARSET_UTF8;
        $mailer->setFrom(
            trim((string) (getenv('Y3D_EMAIL_FROM') ?: getenv('Y3D_SMTP_USER'))),
            'Y3D Creations'
        );
        $mailer->addAddress($destinatario, $nome);
        if ($responderPara !== null) {
            $mailer->addReplyTo($responderPara, $nomeResponder ?? '');
        }
        $mailer->isHTML(false);
        $mailer->Subject = $assunto;
        $mailer->Body = $mensagem;

        return $mailer->send();
    } catch (PHPMailerException $erro) {
        error_log('Falha ao enviar e-mail via SMTP.');
        return false;
    }
}
