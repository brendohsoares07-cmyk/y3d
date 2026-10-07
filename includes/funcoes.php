<?php
// Funções auxiliares do site e do carrinho (guardado na sessão PHP)

date_default_timezone_set('America/Sao_Paulo');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/dados_produtos.php';
require_once __DIR__ . '/contas.php';

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

/** Total do pedido = soma dos produtos, pelo preço normal (a loja não cobra frete no site). */
function y3d_total_carrinho(): float
{
    return y3d_subtotal_carrinho();
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

function y3d_iniciais(string $nome): string
{
    $partes = preg_split('/\s+/', trim($nome));
    $ini = mb_substr($partes[0], 0, 1);
    if (count($partes) > 1) {
        $ini .= mb_substr(end($partes), 0, 1);
    }
    return mb_strtoupper($ini);
}

/**
 * Registra o login na sessão a partir de uma conta real (vinda de contas.php).
 * A senha não é guardada na sessão, só os dados públicos da conta.
 */
function y3d_entrar(array $conta, bool $permitirAdmin = false): void
{
    session_regenerate_id(true);
    $_SESSION['usuario'] = [
        'id'        => (int) ($conta['id'] ?? 0),
        'nome'      => (string) ($conta['nome'] ?? ''),
        'email'     => (string) ($conta['email'] ?? ''),
        'foto'      => $conta['foto'] ?? null,
        'login_em'  => time(),
        // só vale para login por e-mail + senha (login.php); o cadastro nunca concede admin
        'admin'     => $permitirAdmin && !empty($conta['admin']),
    ];
}

/** true se o usuário logado é administrador (campo "admin" da conta em data/usuarios.json). */
function y3d_eh_admin(): bool
{
    $usuario = y3d_usuario();
    return $usuario !== null && ($usuario['admin'] ?? false) === true;
}

function e(mixed $valor): string
{
    return htmlspecialchars((string) $valor, ENT_QUOTES, 'UTF-8');
}

function foto_url(?string $foto): string
{
    if ($foto && trim($foto) !== '') {
        if (preg_match('#^https?://#i', $foto)) {
            return $foto; // foto com endereço completo (URL)
        }
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
