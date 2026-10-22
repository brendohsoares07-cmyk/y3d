<?php
/**
 * Pedidos, mensagens de contato e avaliações da loja.
 * Cada coisa fica num arquivo JSON dentro de data/ (pedidos.json, mensagens.json, avaliacoes.json),
 * do mesmo jeito que as contas em data/usuarios.json. O painel admin (admin.php) lê esses arquivos.
 */

const Y3D_PASTA_DADOS = __DIR__ . '/../data';

/** Status possíveis de um pedido (chave => texto mostrado no admin). */
const Y3D_STATUS_PEDIDO = [
    'aguardando' => 'Aguardando pagamento',
    'pago'       => 'Pago',
    'enviado'    => 'Enviado',
    'entregue'   => 'Entregue',
    'cancelado'  => 'Cancelado',
];

// ---------- leitura e gravação ----------

/** Lê uma lista de registros de data/<nome>.json (devolve [] se o arquivo não existir). */
function y3d_json_ler(string $nome): array
{
    $arquivo = Y3D_PASTA_DADOS . '/' . $nome . '.json';
    if (!is_file($arquivo)) {
        return [];
    }
    $dados = json_decode((string) file_get_contents($arquivo), true);
    return is_array($dados) ? $dados : [];
}

/** Grava a lista inteira, de forma atômica (escreve num temporário e renomeia). */
function y3d_json_salvar(string $nome, array $lista): bool
{
    if (!is_dir(Y3D_PASTA_DADOS)) {
        @mkdir(Y3D_PASTA_DADOS, 0775, true);
    }
    $arquivo = Y3D_PASTA_DADOS . '/' . $nome . '.json';
    $temporario = $arquivo . '.' . uniqid('tmp', true);
    $texto = json_encode(array_values($lista), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($texto === false || @file_put_contents($temporario, $texto) === false) {
        return false;
    }
    return @rename($temporario, $arquivo);
}

/**
 * Faz uma alteração segura na lista: trava o arquivo, lê, chama $alterar(lista) -> lista nova, e grava.
 * Evita que dois pedidos ao mesmo tempo se sobrescrevam.
 */
function y3d_json_alterar(string $nome, callable $alterar): bool
{
    if (!is_dir(Y3D_PASTA_DADOS)) {
        @mkdir(Y3D_PASTA_DADOS, 0775, true);
    }
    $trava = @fopen(Y3D_PASTA_DADOS . '/.' . $nome . '.lock', 'c');
    if ($trava !== false) {
        flock($trava, LOCK_EX);
    }
    $lista = y3d_json_ler($nome);
    $nova = $alterar($lista);
    $ok = y3d_json_salvar($nome, is_array($nova) ? $nova : $lista);
    if ($trava !== false) {
        flock($trava, LOCK_UN);
        fclose($trava);
    }
    return $ok;
}

/** Próximo id (maior id existente + 1). */
function y3d_proximo_id(array $lista): int
{
    $maior = 0;
    foreach ($lista as $registro) {
        $maior = max($maior, (int) ($registro['id'] ?? 0));
    }
    return $maior + 1;
}

// ---------- pedidos ----------

/**
 * Registra um pedido novo. $dados: usuario_id, nome, email, telefone, cpf, cep, endereco, bairro, cidade,
 * pagamento, itens (cada item: id, nome, quantidade, preco) e total. Devolve o id do pedido (0 se falhar).
 */
function y3d_pedido_registrar(array $dados): int
{
    $idNovo = 0;
    $ok = y3d_json_alterar('pedidos', function (array $lista) use ($dados, &$idNovo): array {
        $idNovo = y3d_proximo_id($lista);
        $dados['id'] = $idNovo;
        $dados['status'] = 'aguardando';
        $dados['criado_em'] = time();
        $lista[] = $dados;
        return $lista;
    });
    return $ok ? $idNovo : 0;
}

function y3d_pedido_mudar_status(int $id, string $status): bool
{
    if (!array_key_exists($status, Y3D_STATUS_PEDIDO)) {
        return false;
    }
    return y3d_json_alterar('pedidos', function (array $lista) use ($id, $status): array {
        foreach ($lista as $i => $pedido) {
            if ((int) ($pedido['id'] ?? 0) === $id) {
                $lista[$i]['status'] = $status;
            }
        }
        return $lista;
    });
}

/** Guarda a avaliação do atendimento feita pelo cliente depois da compra (nota 1 a 5 + comentário opcional). */
function y3d_pedido_avaliar(int $id, int $nota, string $comentario): bool
{
    $nota = max(1, min(5, $nota));
    $achou = false;
    $ok = y3d_json_alterar('pedidos', function (array $lista) use ($id, $nota, $comentario, &$achou): array {
        foreach ($lista as $i => $pedido) {
            if ((int) ($pedido['id'] ?? 0) === $id) {
                $lista[$i]['avaliacao_atendimento'] = [
                    'nota'       => $nota,
                    'comentario' => $comentario,
                    'criado_em'  => time(),
                ];
                $achou = true;
            }
        }
        return $lista;
    });
    return $ok && $achou;
}

// ---------- mensagens de contato ----------

function y3d_mensagem_registrar(string $nome, string $email, string $texto): bool
{
    return y3d_json_alterar('mensagens', function (array $lista) use ($nome, $email, $texto): array {
        $lista[] = [
            'id'        => y3d_proximo_id($lista),
            'nome'      => $nome,
            'email'     => $email,
            'mensagem'  => $texto,
            'lida'      => false,
            'criado_em' => time(),
        ];
        return $lista;
    });
}

function y3d_mensagem_marcar_lida(int $id): bool
{
    return y3d_json_alterar('mensagens', function (array $lista) use ($id): array {
        foreach ($lista as $i => $mensagem) {
            if ((int) ($mensagem['id'] ?? 0) === $id) {
                $lista[$i]['lida'] = true;
            }
        }
        return $lista;
    });
}

// ---------- avaliações de produtos ----------

/** Salva a avaliação de um cliente. Cada cliente tem uma por produto: avaliar de novo substitui a anterior. */
function y3d_avaliacao_salvar(int $produtoId, int $usuarioId, string $nome, int $nota, string $comentario): bool
{
    $nota = max(1, min(5, $nota));
    return y3d_json_alterar('avaliacoes', function (array $lista) use ($produtoId, $usuarioId, $nome, $nota, $comentario): array {
        $lista = array_values(array_filter($lista, function (array $a) use ($produtoId, $usuarioId): bool {
            return !((int) ($a['produto_id'] ?? 0) === $produtoId && (int) ($a['usuario_id'] ?? 0) === $usuarioId);
        }));
        $lista[] = [
            'id'         => y3d_proximo_id($lista),
            'produto_id' => $produtoId,
            'usuario_id' => $usuarioId,
            'nome'       => $nome,
            'nota'       => $nota,
            'comentario' => $comentario,
            'criado_em'  => time(),
        ];
        return $lista;
    });
}

function y3d_avaliacao_remover(int $id): bool
{
    return y3d_json_alterar('avaliacoes', function (array $lista) use ($id): array {
        return array_values(array_filter($lista, function (array $a) use ($id): bool {
            return (int) ($a['id'] ?? 0) !== $id;
        }));
    });
}

/** Avaliações de um produto, as mais novas primeiro. */
function y3d_avaliacoes_do_produto(int $produtoId): array
{
    $lista = array_values(array_filter(y3d_json_ler('avaliacoes'), function (array $a) use ($produtoId): bool {
        return (int) ($a['produto_id'] ?? 0) === $produtoId;
    }));
    usort($lista, function (array $a, array $b): int {
        return ((int) ($b['criado_em'] ?? 0)) <=> ((int) ($a['criado_em'] ?? 0));
    });
    return $lista;
}

/**
 * Atualiza nota média e quantidade de avaliações dos produtos do catálogo ($PRODUTOS) com as avaliações reais.
 * Chamada uma vez ao carregar o site, para os cartões e a página do produto mostrarem a nota verdadeira.
 */
function y3d_aplicar_avaliacoes_ao_catalogo(): void
{
    global $PRODUTOS;
    if (!isset($PRODUTOS) || !is_array($PRODUTOS)) {
        return;
    }
    $soma = [];
    $qtd = [];
    foreach (y3d_json_ler('avaliacoes') as $a) {
        $id = (int) ($a['produto_id'] ?? 0);
        $soma[$id] = ($soma[$id] ?? 0) + (int) ($a['nota'] ?? 0);
        $qtd[$id] = ($qtd[$id] ?? 0) + 1;
    }
    foreach ($PRODUTOS as $i => $produto) {
        $id = (int) $produto['id'];
        if (!empty($qtd[$id])) {
            $PRODUTOS[$i]['avaliacao'] = round($soma[$id] / $qtd[$id], 1);
            $PRODUTOS[$i]['num_avaliacoes'] = $qtd[$id];
        }
    }
}

// ---------- proteção dos formulários do admin (CSRF) ----------

function y3d_csrf_token(): string
{
    if (empty($_SESSION['csrf_admin']) || !is_string($_SESSION['csrf_admin'])) {
        $_SESSION['csrf_admin'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf_admin'];
}

function y3d_csrf_valido(?string $token): bool
{
    return is_string($token) && $token !== '' && hash_equals(y3d_csrf_token(), $token);
}
