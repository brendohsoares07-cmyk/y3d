<?php
require_once __DIR__ . '/includes/funcoes.php';
require_once __DIR__ . '/includes/validacoes.php';
// Área restrita: só entra quem fez login com uma conta de administrador.
if (!y3d_eh_admin()) {
    header('Location: login.php');
    exit;
}

$abas = [
    'dashboard'  => ['📊', 'Dashboard'],
    'clientes'   => ['👥', 'Clientes'],
    'produtos'   => ['🧊', 'Produtos'],
    'pedidos'    => ['🧾', 'Pedidos'],
    'avaliacoes' => ['⭐', 'Avaliações'],
    'mensagens'  => ['✉️', 'Mensagens'],
];
$subtitulos = [
    'dashboard'  => 'Visão geral da loja de modelos 3D',
    'clientes'   => 'Quem já se cadastrou ou comprou na loja',
    'produtos'   => 'Catálogo, vendas e notas de cada produto',
    'pedidos'    => 'Pedidos feitos no site, com endereço e status',
    'avaliacoes' => 'O que os clientes acharam dos produtos',
    'mensagens'  => 'Mensagens enviadas pela página de contato',
];
$aba = (string) ($_GET['aba'] ?? 'dashboard');
if (!isset($abas[$aba])) {
    $aba = 'dashboard';
}

// ---------- ações (formulários do painel) ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (y3d_csrf_valido($_POST['csrf'] ?? null)) {
        $acao = (string) ($_POST['acao'] ?? '');
        $idAcao = (int) ($_POST['id'] ?? 0);
        if ($acao === 'pedido_status') {
            y3d_pedido_mudar_status($idAcao, (string) ($_POST['status'] ?? ''));
        } elseif ($acao === 'mensagem_lida') {
            y3d_mensagem_marcar_lida($idAcao);
        } elseif ($acao === 'avaliacao_remover') {
            y3d_avaliacao_remover($idAcao);
        }
    }
    header('Location: admin.php?aba=' . $aba);
    exit;
}

// ---------- dados ----------
$pedidos = y3d_json_ler('pedidos');
usort($pedidos, function (array $a, array $b): int {
    return ((int) ($b['criado_em'] ?? 0)) <=> ((int) ($a['criado_em'] ?? 0));
});
$mensagens = y3d_json_ler('mensagens');
usort($mensagens, function (array $a, array $b): int {
    return ((int) ($b['criado_em'] ?? 0)) <=> ((int) ($a['criado_em'] ?? 0));
});
$avaliacoes = y3d_json_ler('avaliacoes');
usort($avaliacoes, function (array $a, array $b): int {
    return ((int) ($b['criado_em'] ?? 0)) <=> ((int) ($a['criado_em'] ?? 0));
});

function adm_data(int $ts): string
{
    return $ts > 0 ? date('d/m/Y H:i', $ts) : '—';
}

function adm_cpf_formatado(string $cpf): string
{
    return y3d_cpf_formatar($cpf);
}

function adm_cpf_mascara(string $cpf): string
{
    return '•••.•••.•••-' . substr($cpf, -2);
}

function adm_iniciais(string $nome): string
{
    return mb_strtoupper(y3d_iniciais($nome));
}

// Clientes = contas da loja (menos administradores) + quem comprou sem ter conta (agrupado pelo CPF)
$clientes = [];
foreach (y3d_contas_carregar() as $conta) {
    if (!empty($conta['admin'])) {
        continue;
    }
    $clientes['u' . (int) $conta['id']] = [
        'nome'       => (string) ($conta['nome'] ?? ''),
        'email'      => (string) ($conta['email'] ?? ''),
        'cpf'        => y3d_somente_digitos((string) ($conta['cpf'] ?? '')),
        'telefone'   => '',
        'pedidos'    => 0,
        'gasto'      => 0.0,
        'cadastro'   => (int) ($conta['criado_em'] ?? 0),
        'convidado'  => false,
    ];
}
$clientePorCpf = [];
foreach ($clientes as $chave => $cliente) {
    if ($cliente['cpf'] !== '') {
        $clientePorCpf[$cliente['cpf']] = $chave;
    }
}
foreach ($pedidos as $pedido) {
    $cpfPedido = y3d_somente_digitos((string) ($pedido['cpf'] ?? ''));
    $chave = '';
    if (!empty($pedido['usuario_id']) && isset($clientes['u' . (int) $pedido['usuario_id']])) {
        $chave = 'u' . (int) $pedido['usuario_id'];
    } elseif ($cpfPedido !== '' && isset($clientePorCpf[$cpfPedido])) {
        $chave = $clientePorCpf[$cpfPedido];
    } else {
        $chave = 'c' . ($cpfPedido !== '' ? $cpfPedido : 'pedido' . (int) ($pedido['id'] ?? 0));
        if (!isset($clientes[$chave])) {
            $clientes[$chave] = [
                'nome'       => (string) ($pedido['nome'] ?? 'Cliente'),
                'email'      => (string) ($pedido['email'] ?? ''),
                'cpf'        => $cpfPedido,
                'telefone'   => '',
                'pedidos'    => 0,
                'gasto'      => 0.0,
                'cadastro'   => (int) ($pedido['criado_em'] ?? 0),
                'convidado'  => true,
            ];
        }
    }
    if (($pedido['status'] ?? '') !== 'cancelado') {
        $clientes[$chave]['pedidos']++;
        $clientes[$chave]['gasto'] += (float) ($pedido['total'] ?? 0);
    }
    // os pedidos estão do mais novo para o mais antigo: o primeiro telefone encontrado é o mais recente
    if ($clientes[$chave]['telefone'] === '' && trim((string) ($pedido['telefone'] ?? '')) !== '') {
        $clientes[$chave]['telefone'] = trim((string) $pedido['telefone']);
    }
    if ($clientes[$chave]['cpf'] === '' && $cpfPedido !== '') {
        $clientes[$chave]['cpf'] = $cpfPedido;
    }
}
$listaClientes = array_values($clientes);
usort($listaClientes, function (array $a, array $b): int {
    return $b['gasto'] <=> $a['gasto'] ?: strcasecmp($a['nome'], $b['nome']);
});

// Números gerais (pedidos cancelados não entram na receita)
$receita = 0.0;
$qtdPedidosValidos = 0;
$vendidosPorProduto = [];
$mesesNomes = [1 => 'Jan', 2 => 'Fev', 3 => 'Mar', 4 => 'Abr', 5 => 'Mai', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago', 9 => 'Set', 10 => 'Out', 11 => 'Nov', 12 => 'Dez'];
$faturamento = [];
for ($i = 5; $i >= 0; $i--) {
    $ts = strtotime(date('Y-m-01') . ' -' . $i . ' month');
    $faturamento[date('Y-m', $ts)] = ['rotulo' => $mesesNomes[(int) date('n', $ts)], 'valor' => 0.0];
}
foreach ($pedidos as $pedido) {
    if (($pedido['status'] ?? '') === 'cancelado') {
        continue;
    }
    $total = (float) ($pedido['total'] ?? 0);
    $receita += $total;
    $qtdPedidosValidos++;
    $mes = date('Y-m', (int) ($pedido['criado_em'] ?? 0));
    if (isset($faturamento[$mes])) {
        $faturamento[$mes]['valor'] += $total;
    }
    foreach ((array) ($pedido['itens'] ?? []) as $item) {
        $idItem = (int) ($item['id'] ?? 0);
        $vendidosPorProduto[$idItem] = ($vendidosPorProduto[$idItem] ?? 0) + (int) ($item['quantidade'] ?? 0);
    }
}
$ticketMedio = $qtdPedidosValidos > 0 ? $receita / $qtdPedidosValidos : 0.0;
$maiorMes = 0.0;
foreach ($faturamento as $mesDados) {
    $maiorMes = max($maiorMes, $mesDados['valor']);
}
$topClientes = array_slice(array_values(array_filter($listaClientes, function (array $c): bool {
    return $c['gasto'] > 0;
})), 0, 5);
$mensagensNovas = count(array_filter($mensagens, function (array $m): bool {
    return empty($m['lida']);
}));
$pedidosAguardando = count(array_filter($pedidos, function (array $p): bool {
    return ($p['status'] ?? '') === 'aguardando';
}));

// avaliações do atendimento (feitas depois da compra, guardadas dentro de cada pedido)
$avaliacoesAtendimento = array_values(array_filter($pedidos, function (array $p): bool {
    return !empty($p['avaliacao_atendimento']);
}));
usort($avaliacoesAtendimento, function (array $a, array $b): int {
    return ((int) ($b['avaliacao_atendimento']['criado_em'] ?? 0)) <=> ((int) ($a['avaliacao_atendimento']['criado_em'] ?? 0));
});
$mediaAtendimento = 0.0;
if ($avaliacoesAtendimento) {
    $somaAtend = 0;
    foreach ($avaliacoesAtendimento as $p) {
        $somaAtend += (int) $p['avaliacao_atendimento']['nota'];
    }
    $mediaAtendimento = round($somaAtend / count($avaliacoesAtendimento), 1);
}

// notas por produto
$somaNotas = [];
$qtdNotas = [];
foreach ($avaliacoes as $av) {
    $idProd = (int) ($av['produto_id'] ?? 0);
    $somaNotas[$idProd] = ($somaNotas[$idProd] ?? 0) + (int) ($av['nota'] ?? 0);
    $qtdNotas[$idProd] = ($qtdNotas[$idProd] ?? 0) + 1;
}

$rotulosStatus = Y3D_STATUS_PEDIDO;
$csrf = y3d_csrf_token();
$contaAdmin = y3d_usuario();
$nomeAdmin = $contaAdmin ? (string) $contaAdmin['nome'] : 'Administrador';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Y3D Creations | Painel Admin</title>
<link rel="stylesheet" href="admin.css?v=<?= (int) @filemtime(__DIR__ . '/admin.css') ?>">
</head>
<body>
<aside>
  <div class="brand"><div class="scene"><div class="cube"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
    <div><b>Y3D</b><small>CREATIONS</small></div></div>
  <nav>
    <?php foreach ($abas as $chaveAba => $dadosAba): ?>
      <a<?= $aba === $chaveAba ? ' class="on"' : '' ?> href="admin.php?aba=<?= e($chaveAba) ?>"><?= $dadosAba[0] ?> <?= e($dadosAba[1]) ?>
        <?php if ($chaveAba === 'mensagens' && $mensagensNovas > 0): ?><b class="badge"><?= (int) $mensagensNovas ?></b><?php endif; ?>
        <?php if ($chaveAba === 'pedidos' && $pedidosAguardando > 0): ?><b class="badge"><?= (int) $pedidosAguardando ?></b><?php endif; ?>
      </a>
    <?php endforeach; ?>
    <a href="index.php">🏠 Ver a loja</a>
    <a href="logout.php">🚪 Sair</a>
  </nav>
</aside>

<main>
  <header>
    <div><h1>Painel <span>Administrativo</span></h1><p><?= e($subtitulos[$aba]) ?></p></div>
    <div class="user"><span><?= e($nomeAdmin) ?></span><div class="avatar"><?= e(adm_iniciais($nomeAdmin)) ?></div></div>
  </header>

<?php if ($aba === 'dashboard'): ?>

  <section class="kpis" id="kpis">
    <div class="kpi"><div class="ico">👥</div><small>Clientes</small><strong><?= count($listaClientes) ?></strong></div>
    <div class="kpi"><div class="ico">💰</div><small>Receita total</small><strong><?= e(y3d_formatar_preco($receita)) ?></strong></div>
    <div class="kpi"><div class="ico">🧾</div><small>Pedidos</small><strong><?= (int) $qtdPedidosValidos ?></strong></div>
    <div class="kpi"><div class="ico">🎯</div><small>Ticket médio</small><strong><?= e(y3d_formatar_preco($ticketMedio)) ?></strong></div>
    <div class="kpi"><div class="ico">⭐</div><small>Avaliações</small><strong><?= count($avaliacoes) ?></strong></div>
    <div class="kpi"><div class="ico">✉️</div><small>Mensagens novas</small><strong><?= (int) $mensagensNovas ?></strong></div>
  </section>

  <section class="grid">
    <div class="panel"><h2>Faturamento mensal <em>últimos 6 meses</em></h2>
      <div class="chart">
        <?php foreach ($faturamento as $mesDados): ?>
          <div class="bar"><span><?= e(y3d_formatar_preco($mesDados['valor'])) ?></span>
            <div style="height:<?= $maiorMes > 0 ? round($mesDados['valor'] / $maiorMes * 78, 1) : 0 ?>%" title="<?= e(y3d_formatar_preco($mesDados['valor'])) ?>"></div><?= e($mesDados['rotulo']) ?></div>
        <?php endforeach; ?>
      </div>
    </div>
    <div class="panel"><h2>Top clientes <em>por gasto</em></h2>
      <?php if (!$topClientes): ?>
        <p class="empty">Ainda não há compras.</p>
      <?php else: ?>
        <ul class="top">
          <?php foreach ($topClientes as $posicao => $cliente): ?>
            <li><div><span class="rank" style="color:#fff"><?= $posicao + 1 ?></span><?= e($cliente['nome']) ?></div><span><?= e(y3d_formatar_preco($cliente['gasto'])) ?></span></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
    </div>
  </section>

  <section class="panel">
    <h2>Últimos pedidos <em><a class="vermais" href="admin.php?aba=pedidos">ver todos</a></em></h2>
    <?php if (!$pedidos): ?>
      <p class="empty">Nenhum pedido ainda. Quando alguém finalizar uma compra no site, ele aparece aqui.</p>
    <?php else: ?>
      <div class="wrap"><table>
        <thead><tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          <?php foreach (array_slice($pedidos, 0, 5) as $pedido): ?>
            <tr>
              <td>#<?= (int) $pedido['id'] ?></td>
              <td><?= e(adm_data((int) ($pedido['criado_em'] ?? 0))) ?></td>
              <td><?= e($pedido['nome'] ?? '') ?></td>
              <td><?= e(y3d_formatar_preco((float) ($pedido['total'] ?? 0))) ?></td>
              <td><span class="tag st-<?= e($pedido['status'] ?? 'aguardando') ?>"><?= e($rotulosStatus[$pedido['status'] ?? 'aguardando'] ?? '') ?></span></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table></div>
    <?php endif; ?>
  </section>

<?php elseif ($aba === 'clientes'): ?>

  <section class="panel" id="clientes">
    <h2>Clientes cadastrados <em id="count"><?= count($listaClientes) ?> resultado(s)</em></h2>
    <div class="tools">
      <input id="busca" placeholder="Buscar por nome, e-mail, telefone ou CPF...">
      <select id="filtro-status"><option value="">Todos os status</option><option value="ativo">Ativos (já compraram)</option><option value="inativo">Inativos (sem compras)</option></select>
    </div>
    <div class="wrap"><table>
      <thead><tr><th>Cliente</th><th>CPF</th><th>Telefone</th><th>E-mail</th><th>Pedidos</th><th>Total gasto</th><th>Status</th></tr></thead>
      <tbody id="linhas-clientes">
        <?php foreach ($listaClientes as $cliente): ?>
          <?php $statusCliente = $cliente['pedidos'] > 0 ? 'ativo' : 'inativo'; ?>
          <tr data-status="<?= $statusCliente ?>" data-busca="<?= e(mb_strtolower($cliente['nome'] . ' ' . $cliente['email'] . ' ' . $cliente['telefone'] . ' ' . $cliente['cpf'] . ' ' . adm_cpf_formatado($cliente['cpf']))) ?>">
            <td><div class="who"><div class="avatar"><?= e(adm_iniciais($cliente['nome'])) ?></div><?= e($cliente['nome']) ?><?= $cliente['convidado'] ? ' <small class="convidado">sem conta</small>' : '' ?></div></td>
            <td>
              <?php if ($cliente['cpf'] === ''): ?>
                <span class="cpf">—</span>
              <?php else: ?>
                <span class="cpf" data-completo="<?= e(adm_cpf_formatado($cliente['cpf'])) ?>" data-mascara="<?= e(adm_cpf_mascara($cliente['cpf'])) ?>"><?= e(adm_cpf_mascara($cliente['cpf'])) ?></span><button type="button" class="eye" data-ver-cpf>ver</button>
              <?php endif; ?>
            </td>
            <td><?= $cliente['telefone'] !== '' ? e($cliente['telefone']) : '—' ?></td>
            <td><?= $cliente['email'] !== '' ? e($cliente['email']) : '—' ?></td>
            <td><?= (int) $cliente['pedidos'] ?></td>
            <td><?= e(y3d_formatar_preco((float) $cliente['gasto'])) ?></td>
            <td><span class="tag <?= $statusCliente ?>"><?= $statusCliente ?></span></td>
          </tr>
        <?php endforeach; ?>
        <tr id="sem-resultado" class="vazio-linha"<?= $listaClientes ? ' hidden' : '' ?>><td colspan="7" class="empty"><?= $listaClientes ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda' ?></td></tr>
      </tbody>
    </table></div>
  </section>

<?php elseif ($aba === 'produtos'): ?>

  <section class="panel">
    <h2>Produtos <em><?= count($PRODUTOS) ?> no catálogo</em></h2>
    <div class="wrap"><table>
      <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Vendidos</th><th>Nota</th><th></th></tr></thead>
      <tbody>
        <?php foreach ($PRODUTOS as $produto): ?>
          <?php
            $idP = (int) $produto['id'];
            $qtdAv = $qtdNotas[$idP] ?? 0;
            $media = $qtdAv > 0 ? round($somaNotas[$idP] / $qtdAv, 1) : 0;
            $foto = y3d_imagem_principal($produto);
          ?>
          <tr>
            <td><div class="who">
              <?php if ($foto !== ''): ?><img class="thumb" src="<?= e(y3d_miniatura($foto)) ?>" alt="" width="36" height="36" style="width:36px;height:36px;max-width:36px" loading="lazy"><?php else: ?><div class="thumb thumb-emoji"><?= $produto['emoji'] ?></div><?php endif; ?>
              <span><?= e($produto['nome']) ?></span></div></td>
            <td><?= e($CATEGORIAS[$produto['categoria']]['nome'] ?? $produto['categoria']) ?></td>
            <td><?= e(y3d_formatar_preco((float) $produto['preco'])) ?></td>
            <td><?= (int) ($vendidosPorProduto[$idP] ?? 0) ?></td>
            <td><?php if ($qtdAv > 0): ?><span class="estrelas"><?= y3d_estrelas_html((float) $media) ?></span> <?= e($media) ?> <small class="mudo">(<?= (int) $qtdAv ?>)</small><?php else: ?><span class="mudo">sem avaliações</span><?php endif; ?></td>
            <td><a class="eye" href="produto.php?id=<?= $idP ?>" target="_blank" rel="noopener">ver na loja</a></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table></div>
  </section>

<?php elseif ($aba === 'pedidos'): ?>

  <section class="panel">
    <h2>Pedidos <em><?= count($pedidos) ?> no total</em></h2>
    <?php if (!$pedidos): ?>
      <p class="empty">Nenhum pedido ainda. Quando alguém finalizar uma compra no site, ele aparece aqui.</p>
    <?php else: ?>
      <div class="wrap"><table>
        <thead><tr><th>Pedido</th><th>Data</th><th>Cliente</th><th>Itens</th><th>Pagamento</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          <?php foreach ($pedidos as $pedido): ?>
            <?php
              $statusPedido = (string) ($pedido['status'] ?? 'aguardando');
              $resumoItens = [];
              foreach ((array) ($pedido['itens'] ?? []) as $item) {
                  $resumoItens[] = (int) ($item['quantidade'] ?? 1) . '× ' . (string) ($item['nome'] ?? '');
              }
              $pagamentos = ['pix' => 'Pix', 'cartao' => 'Cartão de crédito', 'boleto' => 'Boleto'];
              $formaPg = (string) ($pedido['pagamento'] ?? '');
            ?>
            <tr>
              <td>#<?= (int) $pedido['id'] ?></td>
              <td><?= e(adm_data((int) ($pedido['criado_em'] ?? 0))) ?></td>
              <td>
                <b><?= e($pedido['nome'] ?? '') ?></b>
                <details class="detalhes"><summary>endereço e contato</summary>
                  <div>
                    CPF: <?= e(adm_cpf_formatado((string) ($pedido['cpf'] ?? ''))) ?><br>
                    Telefone: <?= e($pedido['telefone'] ?? '') ?><br>
                    <?php if (!empty($pedido['email'])): ?>E-mail: <?= e($pedido['email']) ?><br><?php endif; ?>
                    <?= e($pedido['endereco'] ?? '') ?><br>
                    <?= e($pedido['bairro'] ?? '') ?> — <?= e($pedido['cidade'] ?? '') ?><br>
                    CEP: <?= e($pedido['cep'] ?? '') ?>
                  </div>
                </details>
              </td>
              <td><?= e(implode(', ', $resumoItens)) ?></td>
              <td><?= e($pagamentos[$formaPg] ?? ($formaPg !== '' ? $formaPg : '—')) ?></td>
              <td><?= e(y3d_formatar_preco((float) ($pedido['total'] ?? 0))) ?></td>
              <td>
                <form method="post" action="admin.php?aba=pedidos" class="inline">
                  <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                  <input type="hidden" name="acao" value="pedido_status">
                  <input type="hidden" name="id" value="<?= (int) $pedido['id'] ?>">
                  <select name="status" class="sel-status st-<?= e($statusPedido) ?>">
                    <?php foreach (Y3D_STATUS_PEDIDO as $valor => $rotulo): ?>
                      <option value="<?= e($valor) ?>"<?= $valor === $statusPedido ? ' selected' : '' ?>><?= e($rotulo) ?></option>
                    <?php endforeach; ?>
                  </select>
                  <button type="submit" class="mini">Salvar</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table></div>
    <?php endif; ?>
  </section>

<?php elseif ($aba === 'avaliacoes'): ?>

  <section class="panel">
    <h2>Avaliações do atendimento <em><?= $avaliacoesAtendimento ? e($mediaAtendimento) . ' de 5 · ' . count($avaliacoesAtendimento) . ' resposta(s)' : 'nenhuma ainda' ?></em></h2>
    <?php if (!$avaliacoesAtendimento): ?>
      <p class="empty">Ainda ninguém avaliou o atendimento. A pergunta aparece para o cliente logo depois que ele finaliza o pedido.</p>
    <?php else: ?>
      <div class="wrap"><table>
        <thead><tr><th>Pedido</th><th>Cliente</th><th>Nota</th><th>Comentário</th><th>Data</th></tr></thead>
        <tbody>
          <?php foreach ($avaliacoesAtendimento as $p): ?>
            <?php $aa = $p['avaliacao_atendimento']; ?>
            <tr>
              <td>#<?= (int) $p['id'] ?></td>
              <td><?= e($p['nome'] ?? '') ?></td>
              <td><span class="estrelas"><?= y3d_estrelas_html((float) ($aa['nota'] ?? 0)) ?></span></td>
              <td class="comentario"><?= trim((string) ($aa['comentario'] ?? '')) !== '' ? nl2br(e($aa['comentario'])) : '<span class="mudo">sem comentário</span>' ?></td>
              <td><?= e(adm_data((int) ($aa['criado_em'] ?? 0))) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table></div>
    <?php endif; ?>
  </section>

  <section class="panel" style="margin-top:22px">
    <h2>Avaliações <em><?= count($avaliacoes) ?> no total</em></h2>
    <?php if (!$avaliacoes): ?>
      <p class="empty">Nenhuma avaliação ainda. Os clientes avaliam na página de cada produto.</p>
    <?php else: ?>
      <div class="wrap"><table>
        <thead><tr><th>Produto</th><th>Cliente</th><th>Nota</th><th>Comentário</th><th>Data</th><th></th></tr></thead>
        <tbody>
          <?php foreach ($avaliacoes as $av): ?>
            <?php $prodAv = y3d_produto_por_id((int) ($av['produto_id'] ?? 0)); ?>
            <tr>
              <td><?= e($prodAv['nome'] ?? 'Produto removido') ?></td>
              <td><?= e($av['nome'] ?? '') ?></td>
              <td><span class="estrelas"><?= y3d_estrelas_html((float) ($av['nota'] ?? 0)) ?></span></td>
              <td class="comentario"><?= trim((string) ($av['comentario'] ?? '')) !== '' ? nl2br(e($av['comentario'])) : '<span class="mudo">sem comentário</span>' ?></td>
              <td><?= e(adm_data((int) ($av['criado_em'] ?? 0))) ?></td>
              <td>
                <form method="post" action="admin.php?aba=avaliacoes" class="inline" onsubmit="return confirm('Remover esta avaliação?')">
                  <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                  <input type="hidden" name="acao" value="avaliacao_remover">
                  <input type="hidden" name="id" value="<?= (int) $av['id'] ?>">
                  <button type="submit" class="mini perigo">Remover</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table></div>
    <?php endif; ?>
  </section>

<?php elseif ($aba === 'mensagens'): ?>

  <section class="panel">
    <h2>Mensagens <em><?= (int) $mensagensNovas ?> nova(s)</em></h2>
    <?php if (!$mensagens): ?>
      <p class="empty">Nenhuma mensagem ainda. Elas chegam pelo formulário da página Contato.</p>
    <?php else: ?>
      <div class="msgs">
        <?php foreach ($mensagens as $msg): ?>
          <article class="msg<?= empty($msg['lida']) ? ' nova' : '' ?>">
            <div class="msg-topo">
              <div><b><?= e($msg['nome'] ?? '') ?></b> <a href="mailto:<?= e($msg['email'] ?? '') ?>"><?= e($msg['email'] ?? '') ?></a></div>
              <small class="mudo"><?= e(adm_data((int) ($msg['criado_em'] ?? 0))) ?></small>
            </div>
            <p><?= nl2br(e($msg['mensagem'] ?? '')) ?></p>
            <div class="msg-acoes">
              <a class="mini" href="mailto:<?= e($msg['email'] ?? '') ?>?subject=<?= rawurlencode('Y3D Creations — resposta à sua mensagem') ?>">Responder por e-mail</a>
              <?php if (empty($msg['lida'])): ?>
                <form method="post" action="admin.php?aba=mensagens" class="inline">
                  <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                  <input type="hidden" name="acao" value="mensagem_lida">
                  <input type="hidden" name="id" value="<?= (int) $msg['id'] ?>">
                  <button type="submit" class="mini">Marcar como lida</button>
                </form>
              <?php else: ?>
                <span class="mudo">lida</span>
              <?php endif; ?>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </section>

<?php endif; ?>
</main>

<script>
(function () {
  // efeito 3D nos cartões do dashboard
  document.querySelectorAll('.kpi').forEach(function (el) {
    el.addEventListener('mousemove', function (ev) {
      var r = el.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      el.style.transform = 'rotateY(' + (x * 18) + 'deg) rotateX(' + (-y * 18) + 'deg) translateZ(10px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  // clientes: mostrar/ocultar CPF
  document.querySelectorAll('[data-ver-cpf]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var cpf = botao.previousElementSibling;
      var aberto = botao.textContent === 'ocultar';
      cpf.textContent = aberto ? cpf.getAttribute('data-mascara') : cpf.getAttribute('data-completo');
      botao.textContent = aberto ? 'ver' : 'ocultar';
    });
  });

  // clientes: busca e filtro de status
  var busca = document.getElementById('busca');
  var filtro = document.getElementById('filtro-status');
  if (busca && filtro) {
    var linhas = document.querySelectorAll('#linhas-clientes tr[data-status]');
    var contador = document.getElementById('count');
    var vazio = document.getElementById('sem-resultado');
    var aplicar = function () {
      var termo = busca.value.toLowerCase().trim(), st = filtro.value, visiveis = 0;
      linhas.forEach(function (linha) {
        var ok = (!st || linha.getAttribute('data-status') === st) && (!termo || linha.getAttribute('data-busca').indexOf(termo) !== -1);
        linha.hidden = !ok;
        if (ok) { visiveis++; }
      });
      contador.textContent = visiveis + ' resultado(s)';
      if (vazio) { vazio.hidden = visiveis !== 0 || linhas.length === 0 ? true : false; }
    };
    busca.addEventListener('input', aplicar);
    filtro.addEventListener('change', aplicar);
  }
})();
</script>
</body>
</html>
