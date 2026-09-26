-- Y3D Creations — criação das tabelas e dados iniciais.
-- Executado automaticamente pelo MySQL apenas na primeira vez que o volume é criado.
SET NAMES utf8mb4;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  cpf CHAR(11) NOT NULL UNIQUE,
  senha_hash VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE,
  descricao TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Relacionamento 1:N — uma categoria tem vários produtos.
-- imagens, personalizacoes e detalhes guardam listas de textos em JSON.
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT NULL,
  preco DECIMAL(10,2) NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  categoria_id INT NOT NULL,
  emoji VARCHAR(16) NULL,
  imagens TEXT NOT NULL,
  personalizacoes TEXT NOT NULL,
  detalhes TEXT NOT NULL,
  avaliacao DECIMAL(2,1) NULL,
  total_avaliacoes INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE maquinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  tipo ENUM('FDM','RESINA','FECHADA') NOT NULL,
  volume_impressao VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Um pedido pertence a um usuário e tem vários itens (pedido_itens → produtos).
-- Pedidos criados pelo painel podem não ter endereço de entrega (colunas entrega_* nulas).
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  status ENUM('PENDENTE','PAGO','ENVIADO','ENTREGUE','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  forma_pagamento ENUM('PIX','CARTAO','BOLETO') NOT NULL DEFAULT 'PIX',
  frete DECIMAL(10,2) NOT NULL DEFAULT 0,
  valor_total DECIMAL(10,2) NOT NULL,
  entrega_nome VARCHAR(120) NULL,
  entrega_telefone VARCHAR(20) NULL,
  entrega_cep CHAR(8) NULL,
  entrega_endereco VARCHAR(160) NULL,
  entrega_bairro VARCHAR(80) NULL,
  entrega_cidade VARCHAR(80) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  personalizacao VARCHAR(120) NULL,
  CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
  CONSTRAINT fk_itens_produto FOREIGN KEY (produto_id) REFERENCES produtos (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Catálogo da parte 1 (categorias e 25 produtos)
INSERT INTO categorias (id, nome, descricao) VALUES
  (1, 'Personagens', 'Modelos e peças 3D de personagens'),
  (2, 'Objetos', 'Modelos e peças 3D de objetos'),
  (3, 'Animais', 'Modelos e peças 3D de animais'),
  (4, 'Cenários', 'Modelos e peças 3D de cenários'),
  (5, 'Props', 'Modelos e peças 3D de props'),
  (6, 'Veículos', 'Modelos e peças 3D de veículos'),
  (7, 'Arquitetura', 'Modelos e peças 3D de arquitetura'),
  (8, 'Tecnologia', 'Modelos e peças 3D de tecnologia'),
  (9, 'Game Assets', 'Modelos e peças 3D de game assets'),
  (10, 'Personalizados', 'Modelos e peças 3D de personalizados');

INSERT INTO produtos (id, nome, descricao, preco, estoque, categoria_id, emoji, imagens, personalizacoes, detalhes, avaliacao, total_avaliacoes) VALUES
  (1, 'Dragão Ancião', 'Modelo 3D de alta qualidade, com detalhes incríveis e pronto para impressão ou uso em projetos digitais. Ideal para colecionadores, artistas e entusiastas de 3D.', 89.90, 100, 3, '🐉', '[]', '[]', '["Formatos: OBJ, STL, FBX, BLEND", "Tamanho do arquivo: 48 MB"]', 4.9, 324),
  (2, 'Guerreiro Saiyajin', 'Personagem estilizado em pose de combate, rigging pronto para animação. Ótimo para jogos e vídeos de ação.', 79.90, 100, 1, '🥋', '[]', '[]', '["Formatos: OBJ, FBX, BLEND", "Tamanho do arquivo: 32 MB"]', 4.8, 412),
  (3, 'Tênis Esportivo Branco', 'Réplica em 3D de um tênis esportivo clássico, com solado detalhado. Pronto para renderização de produto ou impressão.', 69.90, 100, 2, '👟', '[]', '[]', '["Formatos: OBJ, STL", "Tamanho do arquivo: 18 MB"]', 4.7, 298),
  (4, 'Robô Astro', 'Robozinho fofo com juntas articuladas, pronto para animação. Um clássico para portfólios e jogos casuais.', 69.90, 100, 8, '🤖', '[]', '[]', '["Formatos: OBJ, FBX, BLEND", "Tamanho do arquivo: 40 MB"]', 4.6, 187),
  (5, 'Casa Medieval', 'Cenário completo de uma casa medieval iluminada, com texturas em alta resolução. Perfeito para jogos de RPG.', 89.90, 100, 4, '🏚️', '[]', '[]', '["Formatos: OBJ, FBX, BLEND", "Tamanho do arquivo: 65 MB"]', 4.9, 223),
  (6, 'Controle de Videogame', 'Modelo detalhado de um controle de videogame, com botões e analógicos separados por peça.', 49.90, 100, 9, '🎮', '[]', '[]', '["Formatos: OBJ, STL, FBX", "Tamanho do arquivo: 15 MB"]', 4.8, 176),
  (7, 'Espada Fantasia', 'Espada de fantasia com lâmina translúcida e cabo ornamentado. Ideal para renders e impressão 3D.', 59.90, 100, 5, '⚔️', '[]', '[]', '["Formatos: OBJ, STL, FBX", "Tamanho do arquivo: 22 MB"]', 4.7, 154),
  (8, 'Dragão Oriental', 'Dragão de corpo longo e sinuoso, inspirado na mitologia oriental, com escamas em alto detalhe.', 89.90, 100, 3, '🐲', '[]', '[]', '["Formatos: OBJ, FBX, BLEND", "Tamanho do arquivo: 52 MB"]', 4.9, 98),
  (9, 'Capacete Cyber', 'Capacete futurista com viseira luminosa, pronto para cenas cyberpunk e personagens sci-fi.', 69.90, 100, 8, '🪖', '[]', '[]', '["Formatos: OBJ, STL", "Tamanho do arquivo: 28 MB"]', 4.6, 84),
  (10, 'Feiticeira Élfica', 'Personagem feminina com armadura leve e cajado mágico, pronta para cenas de fantasia.', 79.90, 100, 1, '🧝', '[]', '[]', '["Formatos: OBJ, FBX, BLEND", "Tamanho do arquivo: 38 MB"]', 4.8, 61),
  (11, 'Robô de Combate', 'Robô pesado com blindagem e armas embutidas, ideal para jogos de ação e renders cinematográficos.', 99.90, 100, 8, '🦿', '[]', '[]', '["Formatos: OBJ, FBX, BLEND", "Tamanho do arquivo: 58 MB"]', 4.7, 53),
  (12, 'Cenário Montanha', 'Terreno montanhoso completo com neve e rochas, otimizado para uso em jogos e animações.', 119.90, 100, 4, '🏔️', '[]', '[]', '["Formatos: OBJ, FBX", "Tamanho do arquivo: 80 MB"]', 4.9, 47),
  (13, 'Cadeira Gamer', 'Cadeira gamer com estofado detalhado e apoio de braço ajustável, pronta para cenas de setup.', 59.90, 100, 2, '🪑', '[]', '[]', '["Formatos: OBJ, STL, FBX", "Tamanho do arquivo: 24 MB"]', 4.7, 39),
  (14, 'Varinha Mágica Personalizada', 'Varinha impressa em 3D e pintada à mão em degradê, inspirada no universo de magia. Peça física pronta para presentear ou colecionar.', 49.90, 100, 10, '🪄', '[]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Formatos: STL, Peça física", "Tamanho do arquivo: 6 MB", "Peça física impressa em 3D pela Y3D Creations"]', 5.0, 18),
  (15, 'Emblemas ARMY Personalizados', 'Emblemas redondos personalizados, gravados a laser em preto e branco. Ideais para chaveiros, ímãs ou broches de fãs.', 24.90, 100, 10, '🎖️', '["/img/produtos/emblemas-army.png"]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Formatos: STL, Peça física", "Tamanho do arquivo: 4 MB", "Peça física impressa em 3D pela Y3D Creations"]', 5.0, 27),
  (16, 'Quadro Camisa Personalizado', 'Quadro decorativo com camisa de time em relevo 3D, nome, número e patrocinadores impressos. Personalizável para qualquer clube ou jogador.', 129.90, 100, 10, '🖼️', '["/img/produtos/quadro-camisa.png"]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Formatos: Peça física", "Peça física impressa em 3D pela Y3D Creations"]', 5.0, 12),
  (17, 'Estátua Bruxo em Ação', 'Estátua de bruxo em pose de feitiço, impressa em resina com acabamento fosco. Base incluída para exibição em estante.', 79.90, 100, 1, '🧙', '["/img/produtos/estatua-bruxo.png"]', '[]', '["Formatos: OBJ, STL", "Tamanho do arquivo: 35 MB"]', 5.0, 15),
  (18, 'Quadro Retrato Gravado a Laser', 'Retrato gravado a laser em relevo sobre placa, a partir de uma foto enviada pelo cliente. Acabamento em preto e branco de alto contraste.', 99.90, 100, 10, '🖤', '["/img/produtos/quadro-harry-potter.png"]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Formatos: Peça física", "Peça física impressa em 3D pela Y3D Creations"]', 4.9, 9),
  (19, 'Miniaturas Geek Colecionáveis', 'Trio de miniaturas colecionáveis impressas em 3D e pintadas à mão, com acabamento em alto detalhe. Ótimas para estante ou presente.', 44.90, 100, 1, '🧝', '["/img/produtos/miniaturas-personagens.png"]', '[]', '["Formatos: STL, Peça física", "Tamanho do arquivo: 10 MB", "Peça física impressa em 3D pela Y3D Creations"]', 4.9, 41),
  (20, 'Suporte para Controle Gamer', 'Suporte de mesa para controles de videogame, impresso em 3D com encaixe firme. Compatível com os principais modelos do mercado.', 39.90, 100, 9, '🎮', '["/img/produtos/suportes-controles.png"]', '[]', '["Formatos: STL, Peça física", "Tamanho do arquivo: 8 MB", "Peça física impressa em 3D pela Y3D Creations"]', 4.8, 33),
  (22, 'Kit Engrenagens e Suportes 3D', 'Conjunto de engrenagens, suportes e peças funcionais impressas em 3D em cores variadas. Ideal para protótipos e consertos.', 34.90, 100, 5, '⚙️', '["/img/produtos/pecas-personalizadas.png"]', '[]', '["Formatos: STL, Peça física", "Tamanho do arquivo: 9 MB", "Peça física impressa em 3D pela Y3D Creations"]', 4.7, 19),
  (23, 'Coleção de Estátuas Decorativas', 'Estátuas decorativas em diferentes estilos e acabamentos, impressas em 3D. Peça de destaque para escritório ou estante.', 89.90, 100, 1, '🗿', '["/img/produtos/estatuetas.png"]', '[]', '["Formatos: STL, Peça física", "Tamanho do arquivo: 30 MB", "Peça física impressa em 3D pela Y3D Creations"]', 4.9, 22),
  (24, 'Letreiro Y3D Personalizado', 'Letreiro 3D com o nome ou logo que você quiser, iluminável e pronto para pendurar. Ótimo para marcas e ambientes personalizados.', 69.90, 100, 10, '🔤', '["/img/produtos/letreiros-logos.png"]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Formatos: Peça física", "Peça física impressa em 3D pela Y3D Creations"]', 4.8, 16),
  (25, 'Chaveiros Temáticos', 'Chaveiros temáticos impressos em 3D, com opção de personalização de nome ou cor. Pequenos detalhes, grandes significados.', 19.90, 100, 10, '🔑', '["/img/produtos/chaveiros.png"]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Formatos: STL, Peça física", "Tamanho do arquivo: 3 MB", "Peça física impressa em 3D pela Y3D Creations"]', 4.9, 58),
  (26, 'Kit Brindes Personalizados', 'Kit de brindes personalizados com a marca do seu jeito: chaveiro, copo e pin. Ideal para eventos e presentes corporativos.', 54.90, 100, 10, '🎁', '["/img/produtos/brindes-personalizados.png"]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Formatos: Peça física", "Peça física impressa em 3D pela Y3D Creations"]', 4.8, 21);

INSERT INTO maquinas (nome, tipo, volume_impressao) VALUES
  ('Impressora FDM', 'FDM', '220 x 220 x 250 mm'),
  ('Impressora Fechada CoreXY', 'FECHADA', '300 x 300 x 300 mm'),
  ('Impressora de Resina', 'RESINA', '192 x 120 x 200 mm');
