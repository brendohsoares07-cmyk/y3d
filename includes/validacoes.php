<?php
declare(strict_types=1);

/**
 * Validações de dados do cadastro.
 * A mesma regra de CPF existe no frontend React (frontend/src/validations/cpf.ts)
 * e no TypeScript da loja (ts/main.ts) — se mudar aqui, mude lá também.
 */

/** Deixa só os dígitos de um texto (ex.: "123.456.789-09" vira "12345678909"). */
function y3d_somente_digitos(string $valor): string
{
    return preg_replace('/\D+/', '', $valor) ?? '';
}

/**
 * Confere se o CPF é válido: 11 dígitos, não pode ser sequência repetida
 * (111.111.111-11 etc.) e os dois dígitos verificadores precisam bater.
 */
function y3d_cpf_valido(string $cpf): bool
{
    $cpf = y3d_somente_digitos($cpf);
    if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf) === 1) {
        return false;
    }
    for ($tamanho = 9; $tamanho <= 10; $tamanho++) {
        $soma = 0;
        for ($i = 0; $i < $tamanho; $i++) {
            $soma += (int) $cpf[$i] * ($tamanho + 1 - $i);
        }
        $digito = ($soma * 10) % 11;
        if ($digito === 10) {
            $digito = 0;
        }
        if ($digito !== (int) $cpf[$tamanho]) {
            return false;
        }
    }
    return true;
}

/** Formata 11 dígitos como 000.000.000-00 (devolve o texto original se não tiver 11 dígitos). */
function y3d_cpf_formatar(string $cpf): string
{
    $d = y3d_somente_digitos($cpf);
    if (strlen($d) !== 11) {
        return $cpf;
    }
    return substr($d, 0, 3) . '.' . substr($d, 3, 3) . '.' . substr($d, 6, 3) . '-' . substr($d, 9, 2);
}
