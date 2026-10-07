<?php
// Categorias exibidas na home e nos filtros da loja
$CATEGORIAS = [
    'personagens'  => ['nome' => 'Personagens',  'emoji' => '🧙'],
    'objetos'      => ['nome' => 'Objetos',      'emoji' => '🦾'],
    'animais'      => ['nome' => 'Animais',      'emoji' => '🐉'],
    'cenarios'     => ['nome' => 'Cenários',     'emoji' => '🏰'],
    'props'        => ['nome' => 'Props',        'emoji' => '💣'],
    'veiculos'     => ['nome' => 'Veículos',     'emoji' => '🚗'],
    'arquitetura'  => ['nome' => 'Arquitetura',  'emoji' => '🏠'],
    'tecnologia'   => ['nome' => 'Tecnologia',   'emoji' => '🤖'],
    'game-assets'  => ['nome' => 'Game Assets',  'emoji' => '🎮'],
    'personalizados' => ['nome' => 'Personalizados', 'emoji' => '🎁'],
];

// Catálogo de produtos reais da Y3D Creations (fotos e preços atualizados)
$PRODUTOS = [
    [
        'id' => 1, 'nome' => 'Chaveiros Nomes BTS', 'categoria' => 'personalizados',
        'preco' => 8.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff4d5e', 'cor2' => '#ffffff', 'emoji' => '🔑',
        'imagem' => 'assets/img/produtos/chaveiros-nomes-bts.jpg',
        'imagens' => ['assets/img/produtos/chaveiros-nomes-bts.jpg', 'assets/img/produtos/chaveiros.png'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Chaveiros com o nome de cada integrante em relevo vermelho sobre base branca, com corrente de bolinhas. Vendidos por unidade.',
    ],
    [
        'id' => 2, 'nome' => 'Chaveiros Porta-Photocard', 'categoria' => 'personalizados',
        'preco' => 15.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#8b5cf6', 'cor2' => '#ff4d5e', 'emoji' => '🖼️',
        'imagem' => 'assets/img/produtos/chaveiros-porta-photocard.jpg',
        'imagens' => ['assets/img/produtos/chaveiros-porta-photocard.jpg', 'assets/img/produtos/chaveiros.png'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Chaveiro com moldura para photocard, em várias cores com detalhe holográfico e mosquetão. Ideal para levar seu bias sempre junto.',
    ],
    [
        'id' => 3, 'nome' => 'Bandejas BT21', 'categoria' => 'objetos',
        'preco' => 19.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbf2', 'cor2' => '#ff5c93', 'emoji' => '🧸',
        'imagem' => 'assets/img/produtos/bandejas-bt21.jpg',
        'imagens' => ['assets/img/produtos/bandejas-bt21.jpg', 'assets/img/produtos/clipes-bt21.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Bandejinhas ovais com rostinhos dos personagens BT21, ótimas para guardar anéis, clipes e pequenos objetos na mesa.',
    ],
    [
        'id' => 4, 'nome' => 'Porta-Óculos Ovelhinha', 'categoria' => 'objetos',
        'preco' => 29.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ffffff', 'cor2' => '#ff4d5e', 'emoji' => '🐑',
        'imagem' => 'assets/img/produtos/porta-oculos-ovelha.jpg',
        'imagens' => ['assets/img/produtos/porta-oculos-ovelha.jpg', 'assets/img/produtos/porta-oculos-coelho.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Suporte em formato de ovelhinha com lenço vermelho para apoiar seus óculos sem riscar. Ótimo para mesa de cabeceira ou escritório.',
    ],
    [
        'id' => 5, 'nome' => 'Porta-Óculos Coelhinho', 'categoria' => 'objetos',
        'preco' => 29.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff5c93', 'cor2' => '#ffffff', 'emoji' => '🐰',
        'imagem' => 'assets/img/produtos/porta-oculos-coelho.jpg',
        'imagens' => ['assets/img/produtos/porta-oculos-coelho.jpg', 'assets/img/produtos/porta-oculos-ovelha.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Suporte em formato de coelhinho com espaço extra na orelha para pequenos objetos, ideal para apoiar seus óculos sem riscar.',
    ],
    [
        'id' => 6, 'nome' => 'Estátua Guerreira com Espada', 'categoria' => 'personagens',
        'preco' => 180.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ffd23a', 'cor2' => '#8b5cf6', 'emoji' => '🗡️',
        'imagem' => 'assets/img/produtos/estatua-guerreira.jpg',
        'imagens' => ['assets/img/produtos/estatua-guerreira.jpg', 'assets/img/produtos/estatua-anime.jpg', 'assets/img/produtos/estatua-bruxo.png'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Estátua colorida de personagem com jaqueta amarela, trança roxa e espada, impressa em várias cores e com base decorada. Peça de destaque para estante.',
    ],
    [
        'id' => 7, 'nome' => 'Grinch na Poltrona', 'categoria' => 'personagens',
        'preco' => 40.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbb7', 'cor2' => '#ff4d5e', 'emoji' => '🎄',
        'imagem' => 'assets/img/produtos/grinch-poltrona.jpg',
        'imagens' => ['assets/img/produtos/grinch-poltrona.jpg', 'assets/img/produtos/estatua-bruxo.png'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura do Grinch sentado em uma poltrona capitonê vermelha, com acabamento detalhado. Perfeita para decoração de Natal.',
    ],
    [
        'id' => 8, 'nome' => 'Bailarina Rosa', 'categoria' => 'personagens',
        'preco' => 35.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff9ecb', 'cor2' => '#9fd8ff', 'emoji' => '🩰',
        'imagem' => 'assets/img/produtos/bailarina-rosa.jpg',
        'imagens' => ['assets/img/produtos/bailarina-rosa.jpg', 'assets/img/produtos/bailarina-azul.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.',
    ],
    [
        'id' => 9, 'nome' => 'Bailarina Azul', 'categoria' => 'personagens',
        'preco' => 35.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbf2', 'cor2' => '#ff9ecb', 'emoji' => '🩰',
        'imagem' => 'assets/img/produtos/bailarina-azul.jpg',
        'imagens' => ['assets/img/produtos/bailarina-azul.jpg', 'assets/img/produtos/bailarina-rosa.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.',
    ],
    [
        'id' => 10, 'nome' => 'Dinossauros Equilibristas', 'categoria' => 'animais',
        'preco' => 49.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbb7', 'cor2' => '#ffd23a', 'emoji' => '🦖',
        'imagem' => 'assets/img/produtos/dinossauros-equilibrio.jpg',
        'imagens' => ['assets/img/produtos/dinossauros-equilibrio.jpg', 'assets/img/produtos/boneco-articulado.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Jogo de equilíbrio com base curva e dinossauros coloridos para empilhar sem deixar cair. Diversão para crianças e adultos.',
    ],
    [
        'id' => 11, 'nome' => 'Garrafa Térmica JIN', 'categoria' => 'objetos',
        'preco' => 35.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff2f7a', 'cor2' => '#ffffff', 'emoji' => '🥤',
        'imagem' => 'assets/img/produtos/garrafa-termica-jin.jpg',
        'imagens' => ['assets/img/produtos/garrafa-termica-jin.jpg', 'assets/img/produtos/chaveiros.png'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Mini garrafão térmico rosa com nome gravado, canudo, plaquinha "Worldwide Handsome" e chaveiro de personagem. Peça fofa para colecionadores.',
    ],
    [
        'id' => 12, 'nome' => 'Clipes BT21', 'categoria' => 'objetos',
        'preco' => 15.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbf2', 'cor2' => '#ffd23a', 'emoji' => '📎',
        'imagem' => 'assets/img/produtos/clipes-bt21.jpg',
        'imagens' => ['assets/img/produtos/clipes-bt21.jpg', 'assets/img/produtos/bandejas-bt21.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Clipes de mesa com os rostinhos dos personagens BT21, ótimos para segurar papéis, recados e photocards.',
    ],
    [
        'id' => 13, 'nome' => 'Suporte para Lightstick', 'categoria' => 'objetos',
        'preco' => 30.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#1a1a1a', 'cor2' => '#ffffff', 'emoji' => '💡',
        'imagem' => 'assets/img/produtos/suporte-lightstick.jpg',
        'imagens' => ['assets/img/produtos/suporte-lightstick.jpg', 'assets/img/produtos/suportes-controles.png'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Base em formato do símbolo do grupo para apoiar seu lightstick com estabilidade e deixar sua coleção em destaque.',
    ],
    [
        'id' => 14, 'nome' => 'Leque BTS', 'categoria' => 'personalizados',
        'preco' => 25.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#1a1a1a', 'cor2' => '#ff4d5e', 'emoji' => '🪭',
        'imagem' => 'assets/img/produtos/leque-bts.jpg',
        'imagens' => ['assets/img/produtos/leque-bts.jpg', 'assets/img/produtos/quadro-flamengo-paqueta.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Leque articulado impresso em 3D com detalhes em vermelho e borla, inspirado no universo do grupo. Peça de colecionador.',
    ],
    [
        'id' => 15, 'nome' => 'Dragão Preto', 'categoria' => 'animais',
        'preco' => 40.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#1a1a1a', 'cor2' => '#4b6bff', 'emoji' => '🐉',
        'imagem' => 'assets/img/produtos/dragao-preto.jpg',
        'imagens' => ['assets/img/produtos/dragao-preto.jpg', 'assets/img/produtos/dragao-artistico.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Escultura de dragão em preto metalizado com muitos detalhes em relevo. Serve como decoração ou porta-objetos.',
    ],
    [
        'id' => 16, 'nome' => 'Quadro Camisa de Time', 'categoria' => 'personalizados',
        'preco' => 60.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff4d5e', 'cor2' => '#1a1a1a', 'emoji' => '🖼️',
        'imagem' => 'assets/img/produtos/quadro-flamengo-paqueta.jpg',
        'imagens' => ['assets/img/produtos/quadro-flamengo-paqueta.jpg', 'assets/img/produtos/quadro-camisa.png', 'assets/img/produtos/quadro-personalizado.jpg'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Quadro com camisa do time em relevo 3D, com nome, número e patrocinadores. Personalizável para qualquer clube ou jogador.',
    ],
    [
        'id' => 17, 'nome' => 'Chaveiros Emblema BTS', 'categoria' => 'personalizados',
        'preco' => 8.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff4d5e', 'cor2' => '#ffffff', 'emoji' => '🎖️',
        'imagem' => 'assets/img/produtos/chaveiros-emblema.jpg',
        'imagens' => ['assets/img/produtos/chaveiros-emblema.jpg', 'assets/img/produtos/chaveiros.png'],
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Chaveiros com emblema em vermelho e branco e corrente de bolinhas, disponíveis em duas cores de corrente.',
    ],
    [
        'id' => 18, 'nome' => 'Cooky BT21', 'categoria' => 'personagens',
        'preco' => 24.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff5c93', 'cor2' => '#8b5cf6', 'emoji' => '🐰',
        'imagem' => 'assets/img/bt21/cooky.png',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura colecionável do Cooky, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.',
    ],
    [
        'id' => 19, 'nome' => 'Koya BT21', 'categoria' => 'personagens',
        'preco' => 24.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#4b6bff', 'cor2' => '#3ddbf2', 'emoji' => '🐨',
        'imagem' => 'assets/img/bt21/koya.png',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura colecionável do Koya, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.',
    ],
    [
        'id' => 20, 'nome' => 'Tata BT21', 'categoria' => 'personagens',
        'preco' => 24.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff4d5e', 'cor2' => '#4b6bff', 'emoji' => '❤️',
        'imagem' => 'assets/img/bt21/tata.png',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura colecionável do Tata, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.',
    ],
    [
        'id' => 21, 'nome' => 'Chimmy BT21', 'categoria' => 'personagens',
        'preco' => 24.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ffd23d', 'cor2' => '#ffffff', 'emoji' => '🐶',
        'imagem' => 'assets/img/bt21/chimmy.png',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura colecionável do Chimmy, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.',
    ],
    [
        'id' => 22, 'nome' => 'Shooky BT21', 'categoria' => 'personagens',
        'preco' => 24.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#b8742f', 'cor2' => '#ffffff', 'emoji' => '🍪',
        'imagem' => 'assets/img/bt21/shooky.png',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura colecionável do Shooky, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.',
    ],
    [
        'id' => 23, 'nome' => 'Mang BT21', 'categoria' => 'personagens',
        'preco' => 24.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#8b5cf6', 'cor2' => '#3ddbf2', 'emoji' => '🐴',
        'imagem' => 'assets/img/bt21/mang.png',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura colecionável do Mang, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.',
    ],
    [
        'id' => 24, 'nome' => 'RJ BT21', 'categoria' => 'personagens',
        'preco' => 24.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ffffff', 'cor2' => '#ffd23d', 'emoji' => '🐑',
        'imagem' => 'assets/img/bt21/rj.png',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura colecionável do RJ, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.',
    ],
    [
        'id' => 25, 'nome' => 'Coleção Completa BT21', 'categoria' => 'personagens',
        'preco' => 200.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#8b5cf6', 'cor2' => '#ff4fd8', 'emoji' => '🧸',
        'imagem' => 'assets/img/bt21/colecao-completa.png',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Coleção completa BT21 com 10 personagens em miniatura, com jaqueta preta, por um preço promocional.',
    ],
];

function y3d_produto_por_id(int $id): ?array
{
    global $PRODUTOS;
    foreach ($PRODUTOS as $p) {
        if ($p['id'] === $id) return $p;
    }
    return null;
}

function y3d_arquivo_imagem_existe(string $imagem): bool
{
    $imagem = trim((string) $imagem);
    if ($imagem === '') {
        return false;
    }

    $caminhoRelativo = $imagem;
    $caminhoAbsoluto = __DIR__ . '/../' . ltrim($caminhoRelativo, '/');
    return file_exists($caminhoRelativo) || file_exists($caminhoAbsoluto);
}

function y3d_imagens_fallback_arquivos(): array
{
    $pastaBase = __DIR__ . '/../assets/img';
    if (!is_dir($pastaBase)) {
        return [];
    }

    $arquivos = glob($pastaBase . '/WhatsApp Image*.*') ?: [];
    $imagens = [];
    foreach ($arquivos as $arquivo) {
        $relativo = str_replace('\\', '/', substr($arquivo, strlen(dirname(__DIR__)) + 1));
        $imagens[] = $relativo;
    }

    return array_values(array_unique($imagens));
}

function y3d_imagens_do_produto(array $produto): array
{
    $imagens = $produto['imagens'] ?? [];
    if (empty($imagens) && !empty($produto['imagem'] ?? '')) {
        $imagens = [$produto['imagem']];
    }

    $imagens = array_values(array_filter(array_map('trim', $imagens), fn($imagem) => $imagem !== ''));
    $imagens = array_values(array_filter($imagens, fn($imagem) => y3d_arquivo_imagem_existe($imagem)));

    if (empty($imagens) && !empty($produto['imagem'] ?? '')) {
        $imagemPrincipal = trim((string) $produto['imagem']);
        if ($imagemPrincipal !== '' && y3d_arquivo_imagem_existe($imagemPrincipal)) {
            $imagens = [$imagemPrincipal];
        }
    }

    if (empty($imagens)) {
        $imagens = y3d_imagens_fallback_arquivos();
    }

    return array_values(array_unique($imagens));
}

function y3d_imagem_principal(array $produto): string
{
    $imagens = y3d_imagens_do_produto($produto);
    return $imagens[0] ?? ($produto['imagem'] ?? '');
}
