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
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Chaveiros com o nome de cada integrante em relevo vermelho sobre base branca, com corrente de bolinhas. Vendidos por unidade.',
    ],
    [
        'id' => 2, 'nome' => 'Chaveiros Porta-Photocard', 'categoria' => 'personalizados',
        'preco' => 15.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#8b5cf6', 'cor2' => '#ff4d5e', 'emoji' => '🖼️',
        'imagem' => 'assets/img/produtos/chaveiros-porta-photocard.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Chaveiro com moldura para photocard, em várias cores com detalhe holográfico e mosquetão. Ideal para levar seu bias sempre junto.',
    ],
    [
        'id' => 3, 'nome' => 'Bandejas BT21', 'categoria' => 'objetos',
        'preco' => 19.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbf2', 'cor2' => '#ff5c93', 'emoji' => '🧸',
        'imagem' => 'assets/img/produtos/bandejas-bt21.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Bandejinhas ovais com rostinhos dos personagens BT21, ótimas para guardar anéis, clipes e pequenos objetos na mesa.',
    ],
    [
        'id' => 4, 'nome' => 'Porta-Óculos Ovelhinha', 'categoria' => 'objetos',
        'preco' => 29.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ffffff', 'cor2' => '#ff4d5e', 'emoji' => '🐑',
        'imagem' => 'assets/img/produtos/porta-oculos-ovelha.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Suporte em formato de ovelhinha com lenço vermelho para apoiar seus óculos sem riscar. Ótimo para mesa de cabeceira ou escritório.',
    ],
    [
        'id' => 5, 'nome' => 'Porta-Óculos Coelhinho', 'categoria' => 'objetos',
        'preco' => 29.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff5c93', 'cor2' => '#ffffff', 'emoji' => '🐰',
        'imagem' => 'assets/img/produtos/porta-oculos-coelho.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Suporte em formato de coelhinho com espaço extra na orelha para pequenos objetos, ideal para apoiar seus óculos sem riscar.',
    ],
    [
        'id' => 6, 'nome' => 'Estátua Guerreira com Espada', 'categoria' => 'personagens',
        'preco' => 180.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ffd23a', 'cor2' => '#8b5cf6', 'emoji' => '🗡️',
        'imagem' => 'assets/img/produtos/estatua-guerreira.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Estátua colorida de personagem com jaqueta amarela, trança roxa e espada, impressa em várias cores e com base decorada. Peça de destaque para estante.',
    ],
    [
        'id' => 7, 'nome' => 'Grinch na Poltrona', 'categoria' => 'personagens',
        'preco' => 40.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbb7', 'cor2' => '#ff4d5e', 'emoji' => '🎄',
        'imagem' => 'assets/img/produtos/grinch-poltrona.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura do Grinch sentado em uma poltrona capitonê vermelha, com acabamento detalhado. Perfeita para decoração de Natal.',
    ],
    [
        'id' => 8, 'nome' => 'Bailarina Rosa', 'categoria' => 'personagens',
        'preco' => 35.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff9ecb', 'cor2' => '#9fd8ff', 'emoji' => '🩰',
        'imagem' => 'assets/img/produtos/bailarina-rosa.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.',
    ],
    [
        'id' => 9, 'nome' => 'Bailarina Azul', 'categoria' => 'personagens',
        'preco' => 35.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbf2', 'cor2' => '#ff9ecb', 'emoji' => '🩰',
        'imagem' => 'assets/img/produtos/bailarina-azul.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.',
    ],
    [
        'id' => 10, 'nome' => 'Dinossauros Equilibristas', 'categoria' => 'animais',
        'preco' => 49.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbb7', 'cor2' => '#ffd23a', 'emoji' => '🦖',
        'imagem' => 'assets/img/produtos/dinossauros-equilibrio.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Jogo de equilíbrio com base curva e dinossauros coloridos para empilhar sem deixar cair. Diversão para crianças e adultos.',
    ],
    [
        'id' => 11, 'nome' => 'Garrafa Térmica JIN', 'categoria' => 'objetos',
        'preco' => 35.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff2f7a', 'cor2' => '#ffffff', 'emoji' => '🥤',
        'imagem' => 'assets/img/produtos/garrafa-termica-jin.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Mini garrafão térmico rosa com nome gravado, canudo, plaquinha "Worldwide Handsome" e chaveiro de personagem. Peça fofa para colecionadores.',
    ],
    [
        'id' => 12, 'nome' => 'Clipes BT21', 'categoria' => 'objetos',
        'preco' => 15.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbf2', 'cor2' => '#ffd23a', 'emoji' => '📎',
        'imagem' => 'assets/img/produtos/clipes-bt21.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Clipes de mesa com os rostinhos dos personagens BT21, ótimos para segurar papéis, recados e photocards.',
    ],
    [
        'id' => 13, 'nome' => 'Suporte para Lightstick', 'categoria' => 'objetos',
        'preco' => 30.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#1a1a1a', 'cor2' => '#ffffff', 'emoji' => '💡',
        'imagem' => 'assets/img/produtos/suporte-lightstick.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Base em formato do símbolo do grupo para apoiar seu lightstick com estabilidade e deixar sua coleção em destaque.',
    ],
    [
        'id' => 14, 'nome' => 'Leque BTS', 'categoria' => 'personalizados',
        'preco' => 25.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#1a1a1a', 'cor2' => '#ff4d5e', 'emoji' => '🪭',
        'imagem' => 'assets/img/produtos/leque-bts.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Leque articulado impresso em 3D com detalhes em vermelho e borla, inspirado no universo do grupo. Peça de colecionador.',
    ],
    [
        'id' => 15, 'nome' => 'Dragão Preto', 'categoria' => 'animais',
        'preco' => 40.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#1a1a1a', 'cor2' => '#4b6bff', 'emoji' => '🐉',
        'imagem' => 'assets/img/produtos/dragao-preto.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Escultura de dragão em preto metalizado com muitos detalhes em relevo. Serve como decoração ou porta-objetos.',
    ],
    [
        'id' => 16, 'nome' => 'Quadro Camisa de Time', 'categoria' => 'personalizados',
        'preco' => 60.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff4d5e', 'cor2' => '#1a1a1a', 'emoji' => '🖼️',
        'imagem' => 'assets/img/produtos/quadro-flamengo-paqueta.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Quadro com camisa do time em relevo 3D, com nome, número e patrocinadores. Personalizável para qualquer clube ou jogador.',
    ],
    [
        'id' => 17, 'nome' => 'Chaveiros Emblema BTS', 'categoria' => 'personalizados',
        'preco' => 8.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff4d5e', 'cor2' => '#ffffff', 'emoji' => '🎖️',
        'imagem' => 'assets/img/produtos/chaveiros-emblema.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Chaveiros com emblema em vermelho e branco e corrente de bolinhas, disponíveis em duas cores de corrente.',
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
