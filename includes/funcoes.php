<?php
// Funções auxiliares do site e do carrinho (guardado na sessão PHP)

date_default_timezone_set('America/Sao_Paulo');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/dados_produtos.php';

if (!isset($_SESSION['carrinho']) || !is_array($_SESSION['carrinho'])) {
    // formato: [ id_produto => quantidade ]
    $_SESSION['carrinho'] = [];
}

function y3d_formatar_preco(float $valor): string
{
    return 'R$ ' . number_format($valor, 2, ',', '.');
}

function y3d_adicionar_ao_carrinho(int $idProduto, int $quantidade = 1): void
{
    if (!y3d_produto_por_id($idProduto)) return;
    $quantidade = max(1, $quantidade);
    if (isset($_SESSION['carrinho'][$idProduto])) {
        $_SESSION['carrinho'][$idProduto] += $quantidade;
    } else {
        $_SESSION['carrinho'][$idProduto] = $quantidade;
    }
}

function y3d_atualizar_quantidade(int $idProduto, int $quantidade): void
{
    if ($quantidade <= 0) {
        unset($_SESSION['carrinho'][$idProduto]);
        return;
    }
    if (y3d_produto_por_id($idProduto)) {
        $_SESSION['carrinho'][$idProduto] = $quantidade;
    }
}

function y3d_remover_do_carrinho(int $idProduto): void
{
    unset($_SESSION['carrinho'][$idProduto]);
}

function y3d_limpar_carrinho(): void
{
    $_SESSION['carrinho'] = [];
}

/** Retorna os itens do carrinho já com os dados do produto e o subtotal de cada linha. */
function y3d_itens_carrinho(): array
{
    $itens = [];
    foreach ($_SESSION['carrinho'] as $idProduto => $quantidade) {
        $produto = y3d_produto_por_id((int) $idProduto);
        if (!$produto) continue;
        $itens[] = [
            'produto'    => $produto,
            'quantidade' => $quantidade,
            'subtotal'   => $produto['preco'] * $quantidade,
        ];
    }
    return $itens;
}

function y3d_total_itens_carrinho(): int
{
    return array_sum($_SESSION['carrinho']);
}

function y3d_subtotal_carrinho(): float
{
    $subtotal = 0.0;
    foreach (y3d_itens_carrinho() as $item) {
        $subtotal += $item['subtotal'];
    }
    return $subtotal;
}

/** Calcula o frete por região do CEP; sem CEP, o valor ainda não é definido. */
function y3d_frete_carrinho(?string $cep = null): ?float
{
    if (y3d_total_itens_carrinho() === 0) return 0.0;

    $cepNumerico = preg_replace('/\D+/', '', $cep ?? '');
    if (strlen($cepNumerico) !== 8) return null;

    if (y3d_subtotal_carrinho() >= 150) return 0.0;

    $faixasPorRegiao = [
        '0' => 9.90,
        '1' => 14.90,
        '2' => 19.90,
        '3' => 24.90,
        '4' => 29.90,
        '5' => 34.90,
        '6' => 39.90,
        '7' => 34.90,
        '8' => 24.90,
        '9' => 29.90,
    ];

    return $faixasPorRegiao[$cepNumerico[0]] ?? 39.90;
}

function y3d_total_carrinho(?string $cep = null): float
{
    return y3d_subtotal_carrinho() + (y3d_frete_carrinho($cep) ?? 0.0);
}

function y3d_estrelas_html(float $nota): string
{
    $html = '';
    for ($i = 1; $i <= 5; $i++) {
        $html .= $i <= round($nota) ? '★' : '☆';
    }
    return $html;
}

// ---------- usuário logado (demonstração: guardado só na sessão, sem banco) ----------

/** Devolve os dados do usuário logado ou null. */
function y3d_usuario(): ?array
{
    return isset($_SESSION['usuario']) && is_array($_SESSION['usuario']) ? $_SESSION['usuario'] : null;
}

/** Como não há campo "nome" no login, deriva o nome a partir do e-mail: gabriel.lima@x.com -> Gabriel Lima */
function y3d_nome_do_email(string $email): string
{
    $parte = explode('@', $email)[0];
    $parte = preg_replace('/[._\-+]+|\d+/', ' ', $parte);
    $nome = mb_convert_case(trim($parte), MB_CASE_TITLE, 'UTF-8');
    return $nome !== '' ? $nome : 'Cliente Y3D';
}

function y3d_iniciais(string $nome): string
{
    $partes = preg_split('/\s+/', trim($nome));
    $ini = mb_substr($partes[0], 0, 1);
    if (count($partes) > 1) {
        $ini .= mb_substr(end($partes), 0, 1);
    }
    return mb_strtoupper($ini);
}

/** Registra o login na sessão. A senha NÃO é guardada: só o tamanho, para mostrar mascarada. */
function y3d_fazer_login(string $email, string $senha): void
{
    session_regenerate_id(true);
    $_SESSION['usuario'] = [
        'nome'          => y3d_nome_do_email($email),
        'email'         => $email,
        'senha_tamanho' => mb_strlen($senha),
        'login_em'      => time(),
    ];
}

function e(mixed $valor): string
{
    return htmlspecialchars((string) $valor, ENT_QUOTES, 'UTF-8');
}

function foto_url(?string $foto): string
{
    if ($foto && trim($foto) !== '') {
        return 'assets/img/' . ltrim($foto, '/');
    }
    return 'assets/img/logo-icon.svg';
}

function avatar_html(string $nome, ?string $foto = null, string $class = ''): string
{
    $src = foto_url($foto);
    $iniciais = y3d_iniciais($nome);
    $classes = trim('avatar ' . $class);

    if ($foto && trim($foto) !== '') {
        return '<img class="' . e($classes) . '" src="' . e($src) . '" alt="' . e($nome) . '" loading="lazy">';
    }

    return '<span class="' . e($classes) . '">' . e($iniciais) . '</span>';
}
