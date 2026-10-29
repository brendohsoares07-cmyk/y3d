<?php
declare(strict_types=1);

/**
 * Guarda as contas da loja num arquivo JSON simples (data/usuarios.json).
 * É a base para o login funcionar de verdade nesta versão de demonstração
 * (sem exigir um banco de dados MySQL só para o site em PHP).
 *
 * Cada conta: id, nome, email, senha_hash, foto, criado_em (e admin, só nas contas de administrador).
 */

require_once __DIR__ . '/config.php';

const Y3D_ARQUIVO_CONTAS = Y3D_PASTA_DADOS . '/usuarios.json';

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

/** Cria um token temporário de recuperação e persiste apenas seu hash. */
function y3d_token_senha_criar(string $email): ?string
{
    $email = y3d_email_normalizado($email);
    $token = bin2hex(random_bytes(32));
    $hash = hash('sha256', $token);
    $encontrou = false;

    $salvou = y3d_json_alterar('usuarios', function (array $contas) use ($email, $hash, &$encontrou): array {
        foreach ($contas as $indice => $conta) {
            if (y3d_email_normalizado((string) ($conta['email'] ?? '')) === $email) {
                $contas[$indice]['token_senha_hash'] = $hash;
                $contas[$indice]['token_senha_expira_em'] = time() + 3600;
                $encontrou = true;
                break;
            }
        }
        return $contas;
    });

    if (!$salvou) {
        error_log('Não foi possível salvar o token de recuperação de senha.');
        return null;
    }

    return $encontrou ? $token : null;
}

function y3d_conta_por_token_senha(string $token): ?array
{
    if (preg_match('/\A[a-f0-9]{64}\z/', $token) !== 1) {
        return null;
    }

    $hash = hash('sha256', $token);
    foreach (y3d_contas_carregar() as $conta) {
        $hashSalvo = (string) ($conta['token_senha_hash'] ?? '');
        $expiraEm = (int) ($conta['token_senha_expira_em'] ?? 0);
        if ($expiraEm > time() && $hashSalvo !== '' && hash_equals($hashSalvo, $hash)) {
            return $conta;
        }
    }
    return null;
}

function y3d_senha_redefinir_com_token(string $token, string $senha): bool
{
    if (preg_match('/\A[a-f0-9]{64}\z/', $token) !== 1) {
        return false;
    }

    $hash = hash('sha256', $token);
    $atualizou = false;
    $salvou = y3d_json_alterar('usuarios', function (array $contas) use ($hash, $senha, &$atualizou): array {
        foreach ($contas as $indice => $conta) {
            $hashSalvo = (string) ($conta['token_senha_hash'] ?? '');
            $expiraEm = (int) ($conta['token_senha_expira_em'] ?? 0);
            if ($expiraEm > time() && $hashSalvo !== '' && hash_equals($hashSalvo, $hash)) {
                $contas[$indice]['senha_hash'] = password_hash($senha, PASSWORD_DEFAULT);
                unset($contas[$indice]['token_senha_hash'], $contas[$indice]['token_senha_expira_em']);
                $contas[$indice]['atualizado_em'] = time();
                $atualizou = true;
                break;
            }
        }
        return $contas;
    });

    if (!$salvou) {
        error_log('Não foi possível salvar a nova senha da conta.');
        return false;
    }
    return $atualizou;
}

/** Atualiza campos de uma conta (ex.: nome, foto) e devolve a conta já atualizada. */
function y3d_conta_atualizar(int $id, array $campos): ?array
{
    $permitidos = ['nome', 'foto'];
    $contas = y3d_contas_carregar();
    foreach ($contas as $indice => $c) {
        if ((int) ($c['id'] ?? 0) === $id) {
            foreach ($campos as $chave => $valor) {
                if (in_array($chave, $permitidos, true)) {
                    $contas[$indice][$chave] = $valor;
                }
            }
            $contas[$indice]['atualizado_em'] = time();
            y3d_contas_salvar($contas);
            return $contas[$indice];
        }
    }
    return null;
}
