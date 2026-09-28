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
        'id' => 4, 'nome' => 'Porta-Óculos Fofinho', 'categoria' => 'objetos',
        'preco' => 29.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff5c93', 'cor2' => '#ffffff', 'emoji' => '👓',
        'imagem' => 'assets/img/produtos/porta-oculos-ovelha.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Suporte em formato de bichinho para apoiar seus óculos sem riscar. Disponível em ovelhinha e coelhinho.',
    ],
    [
        'id' => 5, 'nome' => 'Estátua Guerreira com Espada', 'categoria' => 'personagens',
        'preco' => 180.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ffd23a', 'cor2' => '#8b5cf6', 'emoji' => '🗡️',
        'imagem' => 'assets/img/produtos/estatua-guerreira.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Estátua colorida de personagem com jaqueta amarela, trança roxa e espada, impressa em várias cores e com base decorada. Peça de destaque para estante.',
    ],
    [
        'id' => 6, 'nome' => 'Grinch na Poltrona', 'categoria' => 'personagens',
        'preco' => 40.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbb7', 'cor2' => '#ff4d5e', 'emoji' => '🎄',
        'imagem' => 'assets/img/produtos/grinch-poltrona.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Miniatura do Grinch sentado em uma poltrona capitonê vermelha, com acabamento detalhado. Perfeita para decoração de Natal.',
    ],
    [
        'id' => 7, 'nome' => 'Bailarina Rosa', 'categoria' => 'personagens',
        'preco' => 35.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#ff9ecb', 'cor2' => '#9fd8ff', 'emoji' => '🩰',
        'imagem' => 'assets/img/produtos/bailarina-rosa.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.',
    ],
    [
        'id' => 8, 'nome' => 'Bailarina Azul', 'categoria' => 'personagens',
        'preco' => 35.00, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbf2', 'cor2' => '#ff9ecb', 'emoji' => '🩰',
        'imagem' => 'assets/img/produtos/bailarina-azul.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.',
    ],
    [
        'id' => 9, 'nome' => 'Dinossauros Equilibristas', 'categoria' => 'animais',
        'preco' => 49.90, 'avaliacao' => 0, 'num_avaliacoes' => 0, 'vendidos' => 0,
        'cor1' => '#3ddbb7', 'cor2' => '#ffd23a', 'emoji' => '🦖',
        'imagem' => 'assets/img/produtos/dinossauros-equilibrio.jpg',
        'formatos' => ['Peça física'], 'tamanho' => 'Impressa em 3D pela Y3D Creations',
        'descricao' => 'Jogo de equilíbrio com base curva e dinossauros coloridos para empilhar sem deixar cair. Diversão para crianças e adultos.',
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
