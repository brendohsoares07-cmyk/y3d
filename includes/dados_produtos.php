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

// Catálogo de modelos 3D (dados fictícios para o projeto)
$PRODUTOS = [
    [
        'id' => 1, 'nome' => 'Casa i Melhoral', 'categoria' => 'arquitetura',
        'preco' => 89.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 324, 'vendidos' => 210,
        'cor1' => '#3ddbf2', 'cor2' => '#4b6bff', 'emoji' => '🏠',
        'imagem' => 'assets/img/produtos/casa-medieval.jpg',
        'formatos' => ['OBJ', 'STL', 'FBX', 'BLEND'], 'tamanho' => '48 MB',
        'descricao' => 'Modelo 3D de alta qualidade, com detalhes incríveis e pronto para impressão ou uso em projetos digitais. Ideal para colecionadores, artistas e entusiastas de 3D.',
    ],
    [
        'id' => 2, 'nome' => 'Organizador de Parede', 'categoria' => 'objetos',
        'preco' => 79.90, 'avaliacao' => 4.8, 'num_avaliacoes' => 412, 'vendidos' => 480,
        'cor1' => '#ffb03a', 'cor2' => '#ff5c93', 'emoji' => '🗂️',
        'imagem' => 'assets/img/produtos/organizador-parede.jpg',
        'formatos' => ['OBJ', 'FBX', 'BLEND'], 'tamanho' => '32 MB',
        'descricao' => 'Organizador de parede modular com múltiplos compartimentos, perfeito para guardar canetas, tesouras e pequenos acessórios com estilo. Fácil de fixar e disponível para impressão ou uso digital.',
    ],
    [
        'id' => 3, 'nome' => 'Suporte de Controle', 'categoria' => 'game-assets',
        'preco' => 69.90, 'avaliacao' => 4.7, 'num_avaliacoes' => 298, 'vendidos' => 190,
        'cor1' => '#eaeaea', 'cor2' => '#9fb0bd', 'emoji' => '🎮',
        'imagem' => 'assets/img/produtos/suporte-controle-gamer.jpg',
        'formatos' => ['OBJ', 'STL'], 'tamanho' => '18 MB',
        'descricao' => 'Suporte ergonômico para controles de videogame, com encaixe firme e acabamento detalhado. Ideal para manter a mesa organizada e o setup em destaque.',
    ],
    [
        'id' => 4, 'nome' => 'Dragão Artístico', 'categoria' => 'animais',
        'preco' => 69.90, 'avaliacao' => 4.6, 'num_avaliacoes' => 187, 'vendidos' => 150,
        'cor1' => '#3ddbb7', 'cor2' => '#4b6bff', 'emoji' => '🐉',
        'imagem' => 'assets/img/produtos/dragao-artistico.jpg',
        'formatos' => ['OBJ', 'FBX', 'BLEND'], 'tamanho' => '40 MB',
        'descricao' => 'Dragão estilizado com escamas em alto relevo e pose dinâmica, pronto para impressão ou renderização. Uma peça de destaque para colecionadores e fãs de fantasia.',
    ],
    [
        'id' => 5, 'nome' => 'Suporte de Celular', 'categoria' => 'objetos',
        'preco' => 89.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 223, 'vendidos' => 140,
        'cor1' => '#ffb03a', 'cor2' => '#8b6bff', 'emoji' => '📱',
        'imagem' => 'assets/img/produtos/suporte-celular.jpg',
        'formatos' => ['OBJ', 'FBX', 'BLEND'], 'tamanho' => '65 MB',
        'descricao' => 'Suporte de celular com design compacto e ângulo ajustável para vídeos e chamadas. Modelo leve, resistente e pronto para impressão 3D.',
    ],
    [
        'id' => 6, 'nome' => 'Vaso Decorativo', 'categoria' => 'objetos',
        'preco' => 49.90, 'avaliacao' => 4.8, 'num_avaliacoes' => 176, 'vendidos' => 260,
        'cor1' => '#8b6bff', 'cor2' => '#3ddbf2', 'emoji' => '🪴',
        'imagem' => 'assets/img/produtos/vaso-decorativo.jpg',
        'formatos' => ['OBJ', 'STL', 'FBX'], 'tamanho' => '15 MB',
        'descricao' => 'Vaso decorativo com padrões geométricos, ideal para plantas pequenas ou suculentas. Um toque moderno para decorar qualquer ambiente.',
    ],
    [
        'id' => 7, 'nome' => 'Caixa Organizadora', 'categoria' => 'objetos',
        'preco' => 59.90, 'avaliacao' => 4.7, 'num_avaliacoes' => 154, 'vendidos' => 120,
        'cor1' => '#4b6bff', 'cor2' => '#ff5c93', 'emoji' => '📦',
        'imagem' => 'assets/img/produtos/caixa-organizadora.jpg',
        'formatos' => ['OBJ', 'STL', 'FBX'], 'tamanho' => '22 MB',
        'descricao' => 'Caixa organizadora com tampa e divisórias internas, perfeita para guardar pequenos objetos, ferramentas ou acessórios com praticidade.',
    ],
    [
        'id' => 8, 'nome' => 'Chaveiro Personalizado', 'categoria' => 'personalizados',
        'preco' => 89.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 98, 'vendidos' => 70,
        'cor1' => '#3ddbf2', 'cor2' => '#3ddbb7', 'emoji' => '🔑',
        'imagem' => 'assets/img/produtos/chaveiro-stitch-azul.jpg',
        'formatos' => ['OBJ', 'FBX', 'BLEND'], 'tamanho' => '52 MB',
        'descricao' => 'Chaveiro personalizado com o nome ou desenho que você quiser, impresso em 3D com acabamento resistente. Ótima opção de presente ou lembrancinha.',
    ],
    [
        'id' => 9, 'nome' => 'Quadro Retrato Gravado a Laser', 'categoria' => 'personalizados',
        'preco' => 69.90, 'avaliacao' => 4.6, 'num_avaliacoes' => 84, 'vendidos' => 60,
        'cor1' => '#3ddbf2', 'cor2' => '#8b6bff', 'emoji' => '🖼️',
        'imagem' => 'assets/img/produtos/quadro-retrato.jpg',
        'formatos' => ['OBJ', 'STL'], 'tamanho' => '28 MB',
        'descricao' => 'Quadro com retrato gravado a laser a partir de uma foto enviada pelo cliente, com acabamento em relevo e alto contraste. Uma forma única de eternizar momentos.',
    ],
    [
        'id' => 10, 'nome' => 'Expositor de Coleção', 'categoria' => 'objetos',
        'preco' => 79.90, 'avaliacao' => 4.8, 'num_avaliacoes' => 61, 'vendidos' => 45,
        'cor1' => '#ff5c93', 'cor2' => '#8b6bff', 'emoji' => '🗃️',
        'imagem' => 'assets/img/produtos/expositor-colecao.jpg',
        'formatos' => ['OBJ', 'FBX', 'BLEND'], 'tamanho' => '38 MB',
        'descricao' => 'Expositor modular para exibir miniaturas, action figures ou coleções, com prateleiras internas e design compacto para mesa ou estante.',
    ],
    [
        'id' => 11, 'nome' => 'Quadro Personalizado', 'categoria' => 'personalizados',
        'preco' => 99.90, 'avaliacao' => 4.7, 'num_avaliacoes' => 53, 'vendidos' => 38,
        'cor1' => '#4b6bff', 'cor2' => '#3ddbf2', 'emoji' => '🖼️',
        'imagem' => 'assets/img/produtos/quadro-personalizado.jpg',
        'formatos' => ['OBJ', 'FBX', 'BLEND'], 'tamanho' => '58 MB',
        'descricao' => 'Quadro personalizado com o texto, imagem ou logo que você escolher, impresso em relevo 3D. Perfeito para presentear ou decorar ambientes.',
    ],
    [
        'id' => 12, 'nome' => 'Estátua Anime', 'categoria' => 'personagens',
        'preco' => 119.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 47, 'vendidos' => 30,
        'cor1' => '#3ddbb7', 'cor2' => '#4b6bff', 'emoji' => '🧍',
        'imagem' => 'assets/img/produtos/estatua-anime.jpg',
        'formatos' => ['OBJ', 'FBX'], 'tamanho' => '80 MB',
        'descricao' => 'Estátua estilo anime com pose expressiva e acabamento detalhado, ideal para colecionadores. Pronta para impressão em alta definição.',
    ],
    [
        'id' => 13, 'nome' => 'Miniatura Decorativa', 'categoria' => 'personagens',
        'preco' => 59.90, 'avaliacao' => 4.7, 'num_avaliacoes' => 39, 'vendidos' => 25,
        'cor1' => '#ff5c93', 'cor2' => '#ffb03a', 'emoji' => '🧸',
        'imagem' => 'assets/img/produtos/miniatura-decorativa.jpg',
        'formatos' => ['OBJ', 'STL', 'FBX'], 'tamanho' => '24 MB',
        'descricao' => 'Miniatura decorativa com design fofo e detalhado, perfeita para estante, mesa de trabalho ou como presente para colecionadores.',
    ],

    // Peças reais impressas pela Y3D (fotos de produção)
    [
        'id' => 14, 'nome' => 'Varinha Mágica Personalizada', 'categoria' => 'personalizados',
        'preco' => 49.90, 'avaliacao' => 5.0, 'num_avaliacoes' => 18, 'vendidos' => 32,
        'cor1' => '#ff5c93', 'cor2' => '#ffb03a', 'emoji' => '🪄',
        'formatos' => ['STL', 'Peça física'], 'tamanho' => '6 MB',
        'imagem' => 'assets/img/produtos/varinha-magica.png',
        'descricao' => 'Varinha impressa em 3D e pintada à mão em degradê, inspirada no universo de magia. Peça física pronta para presentear ou colecionar.',
    ],
    [
        'id' => 15, 'nome' => 'Emblemas ARMY Personalizados', 'categoria' => 'personalizados',
        'preco' => 24.90, 'avaliacao' => 5.0, 'num_avaliacoes' => 27, 'vendidos' => 54,
        'cor1' => '#2b2b2b', 'cor2' => '#4b6bff', 'emoji' => '🎖️',
        'formatos' => ['STL', 'Peça física'], 'tamanho' => '4 MB',
        'imagem' => 'assets/img/produtos/emblemas-army.png',
        'descricao' => 'Emblemas redondos personalizados, gravados a laser em preto e branco. Ideais para chaveiros, ímãs ou broches de fãs.',
    ],
    [
        'id' => 16, 'nome' => 'Boneco Harry Potter', 'categoria' => 'personagens',
        'preco' => 129.90, 'avaliacao' => 5.0, 'num_avaliacoes' => 12, 'vendidos' => 20,
        'cor1' => '#e03131', 'cor2' => '#1a1a1a', 'emoji' => '🖼️',
        'formatos' => ['Peça física'], 'tamanho' => '—',
        'imagem' => 'assets/img/produtos/quadro-flamengo.png',
        'descricao' => 'Boneco do Harry Potter impresso em 3D, com acabamento detalhado e base para exposição. Ideal para fãs e colecionadores.',
    ],
    [
        'id' => 17, 'nome' => 'Estátua Bruxo em Ação', 'categoria' => 'personagens',
        'preco' => 79.90, 'avaliacao' => 5.0, 'num_avaliacoes' => 15, 'vendidos' => 22,
        'cor1' => '#1a1a1a', 'cor2' => '#4b6bff', 'emoji' => '🧙',
        'formatos' => ['OBJ', 'STL'], 'tamanho' => '35 MB',
        'imagem' => 'assets/img/produtos/estatua-bruxo.png',
        'descricao' => 'Estátua de bruxo em pose de feitiço, impressa em resina com acabamento fosco. Base incluída para exibição em estante.',
    ],
    [
        'id' => 18, 'nome' => 'Quadro Retrato Gravado a Laser', 'categoria' => 'personalizados',
        'preco' => 99.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 9, 'vendidos' => 14,
        'cor1' => '#eaeaea', 'cor2' => '#4b6bff', 'emoji' => '🖤',
        'formatos' => ['Peça física'], 'tamanho' => '—',
        'imagem' => 'assets/img/produtos/quadro-harry-potter.png',
        'descricao' => 'Retrato gravado a laser em relevo sobre placa, a partir de uma foto enviada pelo cliente. Acabamento em preto e branco de alto contraste.',
    ],

    // Peças extras com fotos reais de impressão (catálogo Y3D)
    [
        'id' => 19, 'nome' => 'Miniaturas e Personagens', 'categoria' => 'personagens',
        'preco' => 44.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 41, 'vendidos' => 88,
        'cor1' => '#ffb03a', 'cor2' => '#8b6bff', 'emoji' => '🧝',
        'formatos' => ['STL', 'Peça física'], 'tamanho' => '10 MB',
        'imagem' => 'assets/img/produtos/miniaturas-personagens.png',
        'descricao' => 'Trio de miniaturas colecionáveis impressas em 3D e pintadas à mão, com acabamento em alto detalhe. Ótimas para estante ou presente.',
    ],
    [
        'id' => 20, 'nome' => 'Suportes para Controles', 'categoria' => 'game-assets',
        'preco' => 39.90, 'avaliacao' => 4.8, 'num_avaliacoes' => 33, 'vendidos' => 76,
        'cor1' => '#4b6bff', 'cor2' => '#3ddbf2', 'emoji' => '🎮',
        'formatos' => ['STL', 'Peça física'], 'tamanho' => '8 MB',
        'imagem' => 'assets/img/produtos/suportes-controles.png',
        'descricao' => 'Suporte de mesa para controles de videogame, impresso em 3D com encaixe firme. Compatível com os principais modelos do mercado.',
    ],
    [
        'id' => 21, 'nome' => 'Organizador de Mesa', 'categoria' => 'objetos',
        'preco' => 49.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 1248, 'vendidos' => 90,
        'cor1' => '#3ddbf2', 'cor2' => '#4b6bff', 'emoji' => '🖊️',
        'formatos' => ['STL', 'Peça física'], 'tamanho' => '12 MB',
        'imagem' => 'assets/img/produtos/organizador-mesa.jpg',
        'descricao' => 'Organizador de mesa modular para canetas, tesouras e acessórios, impresso em 3D para manter seu espaço organizado.',
    ],
    [
        'id' => 22, 'nome' => 'Peças Personalizadas', 'categoria' => 'props',
        'preco' => 34.90, 'avaliacao' => 4.7, 'num_avaliacoes' => 19, 'vendidos' => 52,
        'cor1' => '#4b6bff', 'cor2' => '#e03131', 'emoji' => '⚙️',
        'formatos' => ['STL', 'Peça física'], 'tamanho' => '9 MB',
        'imagem' => 'assets/img/produtos/pecas-personalizadas.png',
        'descricao' => 'Conjunto de engrenagens, suportes e peças funcionais impressas em 3D em cores variadas. Ideal para protótipos e consertos.',
    ],
    [
        'id' => 23, 'nome' => 'Estatuetas', 'categoria' => 'personagens',
        'preco' => 89.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 22, 'vendidos' => 40,
        'cor1' => '#eaeaea', 'cor2' => '#1a1a1a', 'emoji' => '🗿',
        'formatos' => ['STL', 'Peça física'], 'tamanho' => '30 MB',
        'imagem' => 'assets/img/produtos/estatuetas.png',
        'descricao' => 'Estátuas decorativas em diferentes estilos e acabamentos, impressas em 3D. Peça de destaque para escritório ou estante.',
    ],
    [
        'id' => 24, 'nome' => 'Letreiros e Logos', 'categoria' => 'personalizados',
        'preco' => 69.90, 'avaliacao' => 4.8, 'num_avaliacoes' => 16, 'vendidos' => 30,
        'cor1' => '#8b5cf6', 'cor2' => '#ff4fd8', 'emoji' => '🔤',
        'formatos' => ['Peça física'], 'tamanho' => '—',
        'imagem' => 'assets/img/produtos/letreiros-logos.png',
        'descricao' => 'Letreiro 3D com o nome ou logo que você quiser, iluminável e pronto para pendurar. Ótimo para marcas e ambientes personalizados.',
    ],
    [
        'id' => 25, 'nome' => 'Chaveiros', 'categoria' => 'personalizados',
        'preco' => 19.90, 'avaliacao' => 4.9, 'num_avaliacoes' => 58, 'vendidos' => 102,
        'cor1' => '#ffb03a', 'cor2' => '#ff5c93', 'emoji' => '🔑',
        'formatos' => ['STL', 'Peça física'], 'tamanho' => '3 MB',
        'imagem' => 'assets/img/produtos/chaveiros.png',
        'descricao' => 'Chaveiros temáticos impressos em 3D, com opção de personalização de nome ou cor. Pequenos detalhes, grandes significados.',
    ],
    [
        'id' => 26, 'nome' => 'Brindes e Personalizados', 'categoria' => 'personalizados',
        'preco' => 54.90, 'avaliacao' => 4.8, 'num_avaliacoes' => 21, 'vendidos' => 46,
        'cor1' => '#8b5cf6', 'cor2' => '#4b6bff', 'emoji' => '🎁',
        'formatos' => ['Peça física'], 'tamanho' => '—',
        'imagem' => 'assets/img/produtos/brindes-personalizados.png',
        'descricao' => 'Kit de brindes personalizados com a marca do seu jeito: chaveiro, copo e pin. Ideal para eventos e presentes corporativos.',
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
