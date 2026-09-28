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

-- Catálogo (categorias e produtos com as fotos e preços reais da Y3D Creations)
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
  (1, 'Chaveiros Nomes BTS', 'Chaveiros com o nome de cada integrante em relevo vermelho sobre base branca, com corrente de bolinhas. Vendidos por unidade.', 8.00, 100, 10, '🔑', '["/img/produtos/chaveiros-nomes-bts.jpg"]', '["Nome ou frase gravada", "Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (2, 'Chaveiros Porta-Photocard', 'Chaveiro com moldura para photocard, em várias cores com detalhe holográfico e mosquetão. Ideal para levar seu bias sempre junto.', 15.00, 100, 10, '🖼️', '["/img/produtos/chaveiros-porta-photocard.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (3, 'Bandejas BT21', 'Bandejinhas ovais com rostinhos dos personagens BT21, ótimas para guardar anéis, clipes e pequenos objetos na mesa.', 19.90, 100, 2, '🧸', '["/img/produtos/bandejas-bt21.jpg"]', '["Personagem à escolha", "Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (4, 'Porta-Óculos Ovelhinha', 'Suporte em formato de ovelhinha com lenço vermelho para apoiar seus óculos sem riscar. Ótimo para mesa de cabeceira ou escritório.', 29.90, 100, 2, '🐑', '["/img/produtos/porta-oculos-ovelha.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (5, 'Porta-Óculos Coelhinho', 'Suporte em formato de coelhinho com espaço extra na orelha para pequenos objetos, ideal para apoiar seus óculos sem riscar.', 29.90, 100, 2, '🐰', '["/img/produtos/porta-oculos-coelho.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (6, 'Estátua Guerreira com Espada', 'Estátua colorida de personagem com jaqueta amarela, trança roxa e espada, impressa em várias cores e com base decorada. Peça de destaque para estante.', 180.00, 100, 1, '🗡️', '["/img/produtos/estatua-guerreira.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (7, 'Grinch na Poltrona', 'Miniatura do Grinch sentado em uma poltrona capitonê vermelha, com acabamento detalhado. Perfeita para decoração de Natal.', 40.00, 100, 1, '🎄', '["/img/produtos/grinch-poltrona.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (8, 'Bailarina Rosa', 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.', 35.00, 100, 1, '🩰', '["/img/produtos/bailarina-rosa.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (9, 'Bailarina Azul', 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.', 35.00, 100, 1, '🩰', '["/img/produtos/bailarina-azul.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (10, 'Dinossauros Equilibristas', 'Jogo de equilíbrio com base curva e dinossauros coloridos para empilhar sem deixar cair. Diversão para crianças e adultos.', 49.90, 100, 3, '🦖', '["/img/produtos/dinossauros-equilibrio.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (11, 'Garrafa Térmica JIN', 'Mini garrafão térmico rosa com nome gravado, canudo, plaquinha "Worldwide Handsome" e chaveiro de personagem. Peça fofa para colecionadores.', 35.00, 100, 2, '🥤', '["/img/produtos/garrafa-termica-jin.jpg"]', '["Nome ou frase gravada", "Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (12, 'Clipes BT21', 'Clipes de mesa com os rostinhos dos personagens BT21, ótimos para segurar papéis, recados e photocards.', 15.00, 100, 2, '📎', '["/img/produtos/clipes-bt21.jpg"]', '["Personagem à escolha"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (13, 'Suporte para Lightstick', 'Base em formato do símbolo do grupo para apoiar seu lightstick com estabilidade e deixar sua coleção em destaque.', 30.00, 100, 2, '💡', '["/img/produtos/suporte-lightstick.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (14, 'Leque BTS', 'Leque articulado impresso em 3D com detalhes em vermelho e borla, inspirado no universo do grupo. Peça de colecionador.', 25.00, 100, 10, '🪭', '["/img/produtos/leque-bts.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (15, 'Dragão Preto', 'Escultura de dragão em preto metalizado com muitos detalhes em relevo. Serve como decoração ou porta-objetos.', 40.00, 100, 3, '🐉', '["/img/produtos/dragao-preto.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (16, 'Quadro Camisa de Time', 'Quadro com camisa do time em relevo 3D, com nome, número e patrocinadores. Personalizável para qualquer clube ou jogador.', 60.00, 100, 10, '🖼️', '["/img/produtos/quadro-flamengo-paqueta.jpg"]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (17, 'Chaveiros Emblema BTS', 'Chaveiros com emblema em vermelho e branco e corrente de bolinhas, disponíveis em duas cores de corrente.', 8.00, 100, 10, '🎖️', '["/img/produtos/chaveiros-emblema.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0);

INSERT INTO maquinas (nome, tipo, volume_impressao) VALUES
  ('Impressora FDM', 'FDM', '220 x 220 x 250 mm'),
  ('Impressora Fechada CoreXY', 'FECHADA', '300 x 300 x 300 mm'),
  ('Impressora de Resina', 'RESINA', '192 x 120 x 200 mm');
