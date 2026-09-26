<?php
// includes/helpers.php

// Se o site roda em subpasta (ex.: http://localhost/y3d), use '/y3d'
if (!defined('BASE_URL')) define('BASE_URL', '');

function e($s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function foto_url(?string $foto): string {
    return $foto ? BASE_URL . '/uploads/perfis/' . rawurlencode($foto) : '';
}

/**
 * Avatar redondo: mostra a foto, ou a inicial do nome se não houver foto.
 * O atributo data-avatar permite ao JS atualizar todos os avatares da página
 * (inclusive o do cabeçalho) sem recarregar.
 */
function avatar_html(string $nome, ?string $foto, string $classe = 'avatar'): string {
    $inicial = mb_strtoupper(mb_substr(trim($nome) !== '' ? trim($nome) : '?', 0, 1));
    $conteudo = $foto
        ? '<img src="' . e(foto_url($foto)) . '" alt="">'
        : e($inicial);
    return '<span class="' . e($classe) . '" data-avatar>' . $conteudo . '</span>';
}