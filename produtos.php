<?php
$tituloPagina = 'Produtos';
require_once __DIR__ . '/includes/dados_produtos.php';
require_once __DIR__ . '/includes/header.php';

$categoriaAtiva = $_GET['categoria'] ?? 'todos';
$busca = trim($_GET['busca'] ?? '');

$categoriaImagens = [
  'todos' => 'assets/img/produtos/estatua-guerreira.jpg',
  'personagens' => 'assets/img/produtos/bailarina-rosa.jpg',
  'objetos' => 'assets/img/produtos/bandejas-bt21.jpg',
  'animais' => 'assets/img/produtos/dinossauros-equilibrio.jpg',
  'cenarios' => 'assets/img/produtos/estatua-guerreira.jpg',
  'props' => 'assets/img/produtos/estatua-guerreira.jpg',
  'veiculos' => 'assets/img/produtos/estatua-guerreira.jpg',
  'arquitetura' => 'assets/img/produtos/estatua-guerreira.jpg',
  'tecnologia' => 'assets/img/produtos/estatua-guerreira.jpg',
  'game-assets' => 'assets/img/produtos/estatua-guerreira.jpg',
  'personalizados' => 'assets/img/produtos/chaveiros-porta-photocard.jpg',
];

$lista = $PRODUTOS;
if ($categoriaAtiva !== 'todos' && isset($CATEGORIAS[$categoriaAtiva])) {
    $lista = array_filter($lista, fn($p) => $p['categoria'] === $categoriaAtiva);
}
if ($busca !== '') {
    $termo = mb_strtolower($busca);
    $lista = array_filter($lista, function ($p) use ($termo, $CATEGORIAS) {
        $nomeCategoria = mb_strtolower($CATEGORIAS[$p['categoria']]['nome']);
        return str_contains(mb_strtolower($p['nome']), $termo) || str_contains($nomeCategoria, $termo);
    });
}
?>

<div class="grid" style="grid-template-columns:220px 1fr;gap:24px;align-items:start">
  <aside class="card-panel">
    <h2 style="font-size:15px;margin:0 0 14px">Categorias</h2>
    <ul style="display:grid;gap:4px">
      <li><a class="cat-card" style="<?= $categoriaAtiva === 'todos' ? 'border-color:var(--violet)' : '' ?>" href="produtos.php">
        <span class="cat-ic"><img src="<?= $categoriaImagens['todos'] ?>" alt=""></span><span>Todos</span></a></li>
      <?php foreach ($CATEGORIAS as $slug => $cat): ?>
        <li><a class="cat-card" style="<?= $categoriaAtiva === $slug ? 'border-color:var(--violet)' : '' ?>" href="produtos.php?categoria=<?= $slug ?>">
          <span class="cat-ic"><img src="<?= $categoriaImagens[$slug] ?>" alt=""></span><span><?= htmlspecialchars($cat['nome']) ?></span></a></li>
      <?php endforeach; ?>
    </ul>
  </aside>

  <div>
    <div class="sec-h">
      <h2><?= $busca !== '' ? 'Resultados para "' . htmlspecialchars($busca) . '"' : ($categoriaAtiva !== 'todos' ? htmlspecialchars($CATEGORIAS[$categoriaAtiva]['nome']) : 'Todos os produtos') ?></h2>
      <span class="more"><?= count($lista) ?> produto<?= count($lista) === 1 ? '' : 's' ?></span>
    </div>

    <?php if (!$lista): ?>
      <div class="card-panel" style="text-align:center;color:var(--mute)">
        <p>Nenhum produto encontrado para esse filtro.</p>
        <a href="produtos.php" class="btn btn-outline btn-sm" style="margin-top:10px">Limpar filtros</a>
      </div>
    <?php else: ?>
      <div class="grid g4">
        <?php foreach ($lista as $p) include __DIR__ . '/includes/card_produto.php'; ?>
      </div>
    <?php endif; ?>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
