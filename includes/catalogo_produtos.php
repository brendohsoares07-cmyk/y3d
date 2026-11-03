<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function y3d_catalogo_produtos_ler(): ?array
{
    $arquivo = Y3D_PASTA_DADOS . '/catalogo_produtos.json';
    if (!is_file($arquivo)) {
        return ['products' => [], 'deleted' => []];
    }

    $trava = @fopen(Y3D_PASTA_DADOS . '/.catalogo_produtos.lock', 'c');
    if ($trava === false || !flock($trava, LOCK_SH)) {
        if ($trava !== false) {
            fclose($trava);
        }
        error_log('Não foi possível bloquear o catálogo de produtos para leitura.');
        return null;
    }
    $conteudo = @file_get_contents($arquivo);
    flock($trava, LOCK_UN);
    fclose($trava);

    $dados = is_string($conteudo) ? json_decode($conteudo, true) : null;
    if (
        !is_array($dados)
        || !is_array($dados['products'] ?? null)
        || !is_array($dados['deleted'] ?? null)
    ) {
        error_log('O catálogo personalizado de produtos está inválido ou não pôde ser lido.');
        return null;
    }
    return $dados;
}

function y3d_catalogo_produtos_salvar(array $dados): bool
{
    if (!is_dir(Y3D_PASTA_DADOS) && !@mkdir(Y3D_PASTA_DADOS, 0775, true) && !is_dir(Y3D_PASTA_DADOS)) {
        error_log('Não foi possível criar a pasta de dados do catálogo de produtos.');
        return false;
    }

    $trava = @fopen(Y3D_PASTA_DADOS . '/.catalogo_produtos.lock', 'c');
    if ($trava === false || !flock($trava, LOCK_EX)) {
        if ($trava !== false) {
            fclose($trava);
        }
        error_log('Não foi possível bloquear o catálogo de produtos para edição.');
        return false;
    }

    $texto = json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $arquivo = Y3D_PASTA_DADOS . '/catalogo_produtos.json';
    $temporario = $arquivo . '.' . uniqid('tmp', true);
    $gravado = $texto !== false && @file_put_contents($temporario, $texto) !== false;
    $salvo = $gravado && @rename($temporario, $arquivo);
    if (!$salvo && is_file($temporario)) {
        @unlink($temporario);
    }

    flock($trava, LOCK_UN);
    fclose($trava);
    if (!$salvo) {
        error_log('Não foi possível salvar o catálogo de produtos.');
    }
    return $salvo;
}

function y3d_catalogo_produtos_aplicar(array $produtos): array
{
    global $Y3D_CATALOGO_ERRO;
    $dados = y3d_catalogo_produtos_ler();
    if ($dados === null) {
        $Y3D_CATALOGO_ERRO = 'Não foi possível carregar o catálogo personalizado. Confira os logs do servidor.';
        return $produtos;
    }

    $excluidos = array_fill_keys(array_map('intval', $dados['deleted']), true);
    $personalizados = [];
    foreach ($dados['products'] as $produto) {
        if (is_array($produto) && isset($produto['id'])) {
            $personalizados[(int) $produto['id']] = $produto;
        }
    }

    $catalogo = [];
    foreach ($produtos as $produto) {
        $id = (int) $produto['id'];
        if (isset($excluidos[$id])) {
            continue;
        }
        $catalogo[] = isset($personalizados[$id])
            ? array_replace($produto, $personalizados[$id])
            : $produto;
        unset($personalizados[$id]);
    }
    foreach ($personalizados as $produto) {
        if (!isset($excluidos[(int) $produto['id']])) {
            $catalogo[] = $produto;
        }
    }
    return $catalogo;
}

function y3d_catalogo_produto_validar(array $entrada, int $id): array
{
    global $CATEGORIAS;

    $campo = static function (string $nome) use ($entrada): string {
        $valor = $entrada[$nome] ?? '';
        return is_scalar($valor) ? (string) $valor : '';
    };
    $nome = trim($campo('nome'));
    $categoria = $campo('categoria');
    $precoTexto = trim($campo('preco'));
    $preco = filter_var(str_replace(',', '.', $precoTexto), FILTER_VALIDATE_FLOAT);
    $descricao = trim($campo('descricao'));
    $imagem = trim($campo('imagem'));
    $tamanho = trim($campo('tamanho'));
    $emoji = trim($campo('emoji') ?: '📦');
    $cor1 = $campo('cor1') ?: '#3ddbf2';
    $cor2 = $campo('cor2') ?: '#7c5cff';

    if (mb_strlen($nome) < 2 || mb_strlen($nome) > 100) {
        return ['erro' => 'O nome precisa ter entre 2 e 100 caracteres.'];
    }
    if (!isset($CATEGORIAS[$categoria])) {
        return ['erro' => 'Selecione uma categoria válida.'];
    }
    if ($preco === false || $preco <= 0 || $preco > 1000000) {
        return ['erro' => 'Informe um preço maior que zero e menor que R$ 1.000.000,00.'];
    }
    if (mb_strlen($descricao) > 2000 || mb_strlen($tamanho) > 160) {
        return ['erro' => 'A descrição deve ter até 2.000 caracteres e o tamanho até 160.'];
    }
    if (mb_strlen($imagem) > 500) {
        return ['erro' => 'O caminho da imagem deve ter até 500 caracteres.'];
    }
    if (mb_strlen($emoji) > 8) {
        return ['erro' => 'O ícone deve ter até 8 caracteres.'];
    }
    foreach ([$cor1, $cor2] as $cor) {
        if (preg_match('/\A#[0-9a-fA-F]{6}\z/', $cor) !== 1) {
            return ['erro' => 'Informe as cores no formato hexadecimal, por exemplo #3ddbf2.'];
        }
    }
    if ($imagem !== '') {
        $urlImagem = parse_url($imagem);
        $caminhoLocalValido = preg_match('#\Aassets/img/produtos/[a-zA-Z0-9._/-]+\z#', $imagem) === 1;
        $urlRemotaValida = filter_var($imagem, FILTER_VALIDATE_URL) !== false
            && is_array($urlImagem)
            && strtolower((string) ($urlImagem['scheme'] ?? '')) === 'https';
        if ((!$caminhoLocalValido && !$urlRemotaValida) || strpos($imagem, '..') !== false) {
            return ['erro' => 'Use uma imagem em assets/img/produtos/ ou uma URL HTTPS válida.'];
        }
    }

    return [
        'produto' => [
            'id' => $id,
            'nome' => $nome,
            'categoria' => $categoria,
            'preco' => round((float) $preco, 2),
            'avaliacao' => 0,
            'num_avaliacoes' => 0,
            'vendidos' => 0,
            'cor1' => strtolower($cor1),
            'cor2' => strtolower($cor2),
            'emoji' => $emoji,
            'imagem' => $imagem,
            'imagens' => $imagem === '' ? [] : [$imagem],
            'formatos' => ['Peça física'],
            'tamanho' => $tamanho !== '' ? $tamanho : 'Impressa em 3D pela Y3D Creations',
            'descricao' => $descricao,
        ],
    ];
}

function y3d_catalogo_produto_salvar(array $entrada, int $id): array
{
    global $PRODUTOS;

    $dados = y3d_catalogo_produtos_ler();
    if ($dados === null) {
        return ['erro' => 'O catálogo não pôde ser lido. Nenhuma alteração foi salva.'];
    }

    if ($id > 0 && y3d_produto_por_id($id) === null) {
        return ['erro' => 'O produto que você tentou editar não existe.'];
    }
    if ($id <= 0) {
        $maiorId = 0;
        foreach ($PRODUTOS as $produto) {
            $maiorId = max($maiorId, (int) $produto['id']);
        }
        foreach ($dados['products'] as $produto) {
            if (is_array($produto)) {
                $maiorId = max($maiorId, (int) ($produto['id'] ?? 0));
            }
        }
        $id = $maiorId + 1;
    }

    $validacao = y3d_catalogo_produto_validar($entrada, $id);
    if (isset($validacao['erro'])) {
        return $validacao;
    }

    $encontrado = false;
    foreach ($dados['products'] as $indice => $produto) {
        if (is_array($produto) && (int) ($produto['id'] ?? 0) === $id) {
            $dados['products'][$indice] = $validacao['produto'];
            $encontrado = true;
            break;
        }
    }
    if (!$encontrado) {
        $dados['products'][] = $validacao['produto'];
    }
    $dados['deleted'] = array_values(array_filter(
        array_map('intval', $dados['deleted']),
        static fn (int $idExcluido): bool => $idExcluido !== $id
    ));

    return y3d_catalogo_produtos_salvar($dados)
        ? ['sucesso' => 'Produto salvo com sucesso.']
        : ['erro' => 'Não foi possível salvar o produto. Confira as permissões da pasta de dados.'];
}

function y3d_catalogo_produto_excluir(int $id): array
{
    global $PRODUTOS;
    if ($id <= 0 || y3d_produto_por_id($id) === null) {
        return ['erro' => 'O produto que você tentou excluir não existe.'];
    }

    $dados = y3d_catalogo_produtos_ler();
    if ($dados === null) {
        return ['erro' => 'O catálogo não pôde ser lido. Nenhuma alteração foi salva.'];
    }
    $dados['products'] = array_values(array_filter(
        $dados['products'],
        static fn ($produto): bool => !is_array($produto) || (int) ($produto['id'] ?? 0) !== $id
    ));
    $dados['deleted'] = array_values(array_unique(array_merge(array_map('intval', $dados['deleted']), [$id])));

    return y3d_catalogo_produtos_salvar($dados)
        ? ['sucesso' => 'Produto excluído do catálogo. Os pedidos antigos foram preservados.']
        : ['erro' => 'Não foi possível excluir o produto. Confira as permissões da pasta de dados.'];
}
