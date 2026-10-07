<?php
declare(strict_types=1);

/**
 * Guarda as contas da loja num arquivo JSON simples (data/usuarios.json).
 * É a base para o login funcionar de verdade nesta versão de demonstração
 * (sem exigir um banco de dados MySQL só para o site em PHP).
 *
 * Cada conta: id, nome, email, senha_hash, google_id, foto, criado_em.
 */

require_once __DIR__ . '/config.php';

const Y3D_ARQUIVO_CONTAS = __DIR__ . '/../data/usuarios.json';

function y3d_contas_carregar(): array
{
    if (!is_file(Y3D_ARQUIVO_CONTAS)) {
        return [];
    }
    $conteudo = file_get_contents(Y3D_ARQUIVO_CONTAS);
    $dados = json_decode((string) $conteudo, true);
    return is_array($dados) ? $dados : [];
}

/** Grava a lista inteira de contas, de forma atômica (evita corromper o arquivo). */
function y3d_contas_salvar(array $contas): void
{
    $pasta = dirname(Y3D_ARQUIVO_CONTAS);
    if (!is_dir($pasta)) {
        mkdir($pasta, 0775, true);
    }
    $temporario = Y3D_ARQUIVO_CONTAS . '.' . uniqid('tmp', true);
    file_put_contents($temporario, json_encode(array_values($contas), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    rename($temporario, Y3D_ARQUIVO_CONTAS);
}

function y3d_email_normalizado(string $email): string
{
    return mb_strtolower(trim($email));
}

function y3d_conta_por_email(string $email): ?array
{
    $email = y3d_email_normalizado($email);
    foreach (y3d_contas_carregar() as $conta) {
        if (y3d_email_normalizado((string) ($conta['email'] ?? '')) === $email) {
            return $conta;
        }
    }
    return null;
}

/** Cria uma conta comum (e-mail + senha). Devolve null se o e-mail já existir. */
function y3d_criar_conta(string $nome, string $email, string $senha): ?array
{
    if (y3d_conta_por_email($email) !== null) {
        return null;
    }
    $contas = y3d_contas_carregar();
    $proximoId = 1;
    foreach ($contas as $c) {
        $proximoId = max($proximoId, (int) ($c['id'] ?? 0) + 1);
    }
    $conta = [
        'id'         => $proximoId,
        'nome'       => trim($nome),
        'email'      => y3d_email_normalizado($email),
        'senha_hash' => password_hash($senha, PASSWORD_DEFAULT),
        'google_id'  => null,
        'foto'       => null,
        'criado_em'  => time(),
    ];
    $contas[] = $conta;
    y3d_contas_salvar($contas);
    return $conta;
}

function y3d_verificar_senha(array $conta, string $senha): bool
{
    return !empty($conta['senha_hash']) && password_verify($senha, (string) $conta['senha_hash']);
}

/**
 * Liga uma conta já existente ao Google: guarda o google_id e aproveita a foto do
 * perfil do Google. NÃO cria conta nova — só é chamada depois de confirmar que o
 * e-mail já está cadastrado.
 */
function y3d_conta_vincular_google(array $conta, string $googleId, ?string $nome, ?string $foto): array
{
    $contas = y3d_contas_carregar();
    foreach ($contas as $indice => $c) {
        if ((int) ($c['id'] ?? 0) === (int) $conta['id']) {
            $contas[$indice]['google_id'] = $googleId;
            if ($foto) {
                $contas[$indice]['foto'] = $foto;
            }
            if (empty($contas[$indice]['nome']) && $nome) {
                $contas[$indice]['nome'] = $nome;
            }
            $contas[$indice]['atualizado_em'] = time();
            $conta = $contas[$indice];
            break;
        }
    }
    y3d_contas_salvar($contas);
    return $conta;
}
