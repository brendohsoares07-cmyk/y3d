-- Script único do banco de dados Y3D Creations: estrutura e catálogo inicial.
-- Pode ser executado em banco vazio e reaplicado pelo serviço db-sync.

-- Y3D Creations — criação das tabelas (estrutura do banco).
-- Executado automaticamente pelo MySQL apenas na primeira vez que o volume é criado.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  cpf CHAR(11) NULL UNIQUE,
  senha_hash VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE usuarios MODIFY COLUMN cpf CHAR(11) NULL;

DROP PROCEDURE IF EXISTS y3d_add_column_if_missing;
DELIMITER //
CREATE PROCEDURE y3d_add_column_if_missing(
  IN p_table_name VARCHAR(64),
  IN p_column_name VARCHAR(64),
  IN p_definition VARCHAR(255)
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table_name
      AND COLUMN_NAME = p_column_name
  ) THEN
    SET @y3d_add_column_sql = CONCAT(
      'ALTER TABLE `', REPLACE(p_table_name, '`', '``'),
      '` ADD COLUMN `', REPLACE(p_column_name, '`', '``'),
      '` ', p_definition
    );
    PREPARE y3d_add_column_statement FROM @y3d_add_column_sql;
    EXECUTE y3d_add_column_statement;
    DEALLOCATE PREPARE y3d_add_column_statement;
  END IF;
END//
DELIMITER ;

CALL y3d_add_column_if_missing('usuarios', 'foto', 'VARCHAR(255) NULL');

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE,
  descricao TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Relacionamento 1:N — uma categoria tem vários produtos.
-- imagens, personalizacoes e detalhes guardam listas de textos em JSON.
CREATE TABLE IF NOT EXISTS produtos (
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

CREATE TABLE IF NOT EXISTS maquinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  tipo ENUM('FDM','RESINA','FECHADA') NOT NULL,
  volume_impressao VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Um pedido pertence a um usuário e tem vários itens (pedido_itens → produtos).
-- Pedidos criados pelo painel podem não ter endereço de entrega (colunas entrega_* nulas).
CREATE TABLE IF NOT EXISTS pedidos (
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

CREATE TABLE IF NOT EXISTS pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  personalizacao VARCHAR(120) NULL,
  CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
  CONSTRAINT fk_itens_produto FOREIGN KEY (produto_id) REFERENCES produtos (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Controle de versão do catálogo, usado pelo serviço db-sync.
CREATE TABLE IF NOT EXISTS catalogo_versao (
  id TINYINT PRIMARY KEY,
  hash CHAR(64) NOT NULL,
  aplicado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dados iniciais: categorias, produtos e máquinas.
-- Y3D Creations — dados iniciais (catálogo, categorias e máquinas).
-- Aplicado automaticamente pelo serviço db-sync do docker-compose (a cada `docker compose up`
-- em que ESTE arquivo mudou). Pode rodar quantas vezes precisar: tudo aqui é idempotente.
-- A tabela catalogo_versao é criada na seção de estrutura acima.
SET NAMES utf8mb4;

-- Catálogo (categorias e produtos com as fotos e preços reais da Y3D Creations)
INSERT INTO categorias (id, nome, descricao) VALUES
  (1, 'Personagens', 'Modelos e peças 3D de personagens'),
  (2, 'Objetos', 'Modelos e peças 3D de objetos'),
  (3, 'Animais', 'Modelos e peças 3D de animais'),
  (10, 'Personalizados', 'Modelos e peças 3D personalizados')
AS novo ON DUPLICATE KEY UPDATE nome = novo.nome, descricao = novo.descricao;

INSERT INTO produtos (id, nome, descricao, preco, estoque, categoria_id, emoji, imagens, personalizacoes, detalhes, avaliacao, total_avaliacoes) VALUES
  (1, 'Chaveiros Nomes BTS', 'Chaveiros com o nome de cada integrante em relevo vermelho sobre base branca, com corrente de bolinhas. Vendidos por unidade.', 8.00, 100, 10, '🔑', '["/img/produtos/chaveiros-nomes-bts.jpg"]', '["Nome ou frase gravada", "Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (2, 'Chaveiros Porta-Photocard', 'Chaveiro com moldura para photocard, em várias cores com detalhe holográfico e mosquetão. Ideal para levar seu bias sempre junto.', 15.00, 100, 10, '🖼️', '["/img/produtos/chaveiros-porta-photocard.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (3, 'Bandejas BT21', 'Bandejinhas ovais com rostinhos dos personagens BT21, ótimas para guardar anéis, clipes e pequenos objetos na mesa.', 19.90, 100, 2, '🧸', '["/img/produtos/bandejas-bt21.jpg"]', '["Personagem à escolha", "Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (4, 'Porta-Óculos Ovelhinha', 'Suporte em formato de ovelhinha com lenço vermelho para apoiar seus óculos sem riscar. Ótimo para mesa de cabeceira ou escritório.', 29.90, 100, 2, '🐑', '["/img/produtos/porta-oculos-ovelha.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (6, 'Estátua Guerreira com Espada', 'Estátua colorida de personagem com jaqueta amarela, trança roxa e espada, impressa em várias cores e com base decorada. Peça de destaque para estante.', 180.00, 100, 1, '🗡️', '["/img/produtos/estatua-guerreira.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (7, 'Grinch na Poltrona', 'Miniatura do Grinch sentado em uma poltrona capitonê vermelha, com acabamento detalhado. Perfeita para decoração de Natal.', 40.00, 100, 1, '🎄', '["/img/produtos/grinch-poltrona.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (8, 'Bailarina Rosa', 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.', 35.00, 100, 1, '🩰', '["/img/produtos/bailarina-rosa.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (10, 'Dinossauros Equilibristas', 'Jogo de equilíbrio com base curva e dinossauros coloridos para empilhar sem deixar cair. Diversão para crianças e adultos.', 49.90, 100, 3, '🦖', '["/img/produtos/dinossauros-equilibrio.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (11, 'Garrafa Térmica JIN', 'Mini garrafão térmico rosa com nome gravado, canudo, plaquinha "Worldwide Handsome" e chaveiro de personagem. Peça fofa para colecionadores.', 35.00, 100, 2, '🥤', '["/img/produtos/garrafa-termica-jin.jpg"]', '["Nome ou frase gravada", "Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (14, 'Leque BTS', 'Leque articulado impresso em 3D com detalhes em vermelho e borla, inspirado no universo do grupo. Peça de colecionador.', 25.00, 100, 10, '🪭', '["/img/produtos/leque-bts.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (15, 'Dragão Preto', 'Escultura de dragão em preto metalizado com muitos detalhes em relevo. Serve como decoração ou porta-objetos.', 40.00, 100, 3, '🐉', '["/img/produtos/dragao-preto.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (16, 'Quadro Camisa de Time', 'Quadro com camisa do time em relevo 3D, com nome, número e patrocinadores. Personalizável para qualquer clube ou jogador.', 60.00, 100, 10, '🖼️', '["/img/produtos/quadro-flamengo-paqueta.jpg"]', '["Nome ou frase gravada", "Cores personalizadas", "Enviar minha própria arte"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (29, 'Bowser', 'Miniatura do Bowser com casco e espinhos coloridos, impressa em 3D e pintada com detalhes.', 140.00, 100, 1, '🐢', '["/img/produtos/bowser.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (30, 'Combo Personagens', 'Combo promocional com as quatro peças: Estátua Guerreira com Espada, Bowser, Grinch na Poltrona e Bailarina Rosa. As peças saem por R$ 395,00 compradas separadamente; no combo, você economiza R$ 46,00.', 349.00, 100, 1, '🎁', '["/img/produtos/estatua-guerreira.jpg", "/img/produtos/bowser.jpg", "/img/produtos/grinch-poltrona.jpg", "/img/produtos/bailarina-rosa.jpg"]', '[]', '["Combo com 4 peças físicas impressas em 3D pela Y3D Creations"]', NULL, 0),
  (31, 'Suporte de Controle Guerreiro', 'Suporte para controle de videogame em formato de guerreiro sombrio com sabre vermelho. Deixa seu controle em destaque e sempre à mão.', 45.00, 100, 2, '🎮', '["/img/produtos/suporte-controle-guerreiro.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (32, 'Kit Porta-Lata Monster', 'Porta-lata em formato de caneca com alça e estampa de garras, acompanhado de tampa decorada e plaquinha com chaveiro de corrente. Tudo impresso em 3D.', 49.90, 100, 2, '🥤', '["/img/produtos/porta-lata-monster.jpg"]', '["Cores personalizadas"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (33, 'Boneco Personalizado Bobblehead', 'Boneco estilo bobblehead personalizado, com cabelo, barba, roupa e nome gravado na base. Peça única, feita sob medida.', 120.00, 100, 10, '🧑', '["/img/produtos/boneco-personalizado-kent.jpg"]', '["Nome ou frase gravada", "Enviar minha própria arte"]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0),
  (34, 'Chaveiros Power Ranger e Mini Peças', 'Chaveiros impressos em 3D de personagens e itens divertidos, como o Power Ranger vermelho, dinossauro, controle e cubo mágico.', 15.00, 100, 10, '🔑', '["/img/produtos/chaveiros-power-ranger.jpg"]', '[]', '["Peça física impressa em 3D pela Y3D Creations"]', NULL, 0)
AS novo ON DUPLICATE KEY UPDATE nome = novo.nome, descricao = novo.descricao, preco = novo.preco, estoque = novo.estoque, categoria_id = novo.categoria_id, emoji = novo.emoji, imagens = novo.imagens, personalizacoes = novo.personalizacoes, detalhes = novo.detalhes, avaliacao = novo.avaliacao, total_avaliacoes = novo.total_avaliacoes;

-- Máquinas: só entram se ainda não existirem (não duplica a cada sincronização).
INSERT INTO maquinas (nome, tipo, volume_impressao)
  SELECT 'Impressora FDM', 'FDM', '220 x 220 x 250 mm' FROM DUAL
  WHERE NOT EXISTS (SELECT 1 FROM maquinas WHERE nome = 'Impressora FDM');
INSERT INTO maquinas (nome, tipo, volume_impressao)
  SELECT 'Impressora Fechada CoreXY', 'FECHADA', '300 x 300 x 300 mm' FROM DUAL
  WHERE NOT EXISTS (SELECT 1 FROM maquinas WHERE nome = 'Impressora Fechada CoreXY');
INSERT INTO maquinas (nome, tipo, volume_impressao)
  SELECT 'Impressora de Resina', 'RESINA', '192 x 120 x 200 mm' FROM DUAL
  WHERE NOT EXISTS (SELECT 1 FROM maquinas WHERE nome = 'Impressora de Resina');

-- Limpeza do catálogo ANTIGO (ids acima de 17, exceto os produtos 29 a 34): roda SÓ na primeira sincronização
-- (enquanto catalogo_versao está vazia).
-- Apaga os que nunca foram pedidos e zera o estoque dos que já têm pedido.
-- Se um dia o catálogo mudar, ajuste as exclusões abaixo.
DELETE FROM produtos
  WHERE id > 17 AND id NOT IN (29, 30, 31, 32, 33, 34)
  AND id NOT IN (SELECT produto_id FROM pedido_itens)
  AND NOT EXISTS (SELECT 1 FROM catalogo_versao);
UPDATE produtos SET estoque = 0
  WHERE id > 17 AND id NOT IN (29, 30, 31, 32, 33, 34)
  AND NOT EXISTS (SELECT 1 FROM catalogo_versao);

-- Produtos retirados do catálogo (sem foto nova): apaga os que nunca foram pedidos e zera o estoque dos demais.
DELETE FROM produtos
  WHERE id IN (5, 9, 12, 13, 17, 26, 27, 28)
  AND id NOT IN (SELECT produto_id FROM pedido_itens);
UPDATE produtos SET estoque = 0
  WHERE id IN (5, 9, 12, 13, 17, 26, 27, 28);

-- Recursos migrados da loja PHP: mensagens, avaliações e dados de entrega.
CREATE TABLE IF NOT EXISTS mensagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  mensagem TEXT NOT NULL,
  lida TINYINT(1) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS avaliacoes_produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  usuario_nome VARCHAR(120) NOT NULL,
  nota TINYINT UNSIGNED NOT NULL,
  comentario VARCHAR(600) NOT NULL DEFAULT '',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_avaliacao_cliente_produto (produto_id, usuario_id),
  CONSTRAINT fk_avaliacao_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  CONSTRAINT fk_avaliacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT chk_avaliacao_nota CHECK (nota BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CALL y3d_add_column_if_missing('pedidos', 'entrega_cpf', 'CHAR(11) NULL');
CALL y3d_add_column_if_missing('pedidos', 'pix_informado_em', 'TIMESTAMP NULL');


-- Catálogo completo da loja original (25 produtos), com fotos, cores, formatos e informações.
CALL y3d_add_column_if_missing('produtos', 'cor1', 'VARCHAR(7) NULL');
CALL y3d_add_column_if_missing('produtos', 'cor2', 'VARCHAR(7) NULL');
CALL y3d_add_column_if_missing('produtos', 'formatos', 'TEXT NULL');
CALL y3d_add_column_if_missing('produtos', 'tamanho', 'VARCHAR(160) NULL');
CALL y3d_add_column_if_missing('produtos', 'vendidos', 'INT NOT NULL DEFAULT 0');
DROP PROCEDURE y3d_add_column_if_missing;

INSERT INTO produtos (id, nome, descricao, preco, estoque, categoria_id, emoji, imagens, personalizacoes, detalhes, avaliacao, total_avaliacoes, cor1, cor2, formatos, tamanho, vendidos) VALUES
  (1, 'Chaveiros Nomes BTS', 'Chaveiros com o nome de cada integrante em relevo vermelho sobre base branca, com corrente de bolinhas. Vendidos por unidade.', 8, 100, 10, '🔑', '["/assets/img/produtos/chaveiros-nomes-bts.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ff4d5e', '#ffffff', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (2, 'Chaveiros Porta-Photocard', 'Chaveiro com moldura para photocard, em várias cores com detalhe holográfico e mosquetão. Ideal para levar seu bias sempre junto.', 15, 100, 10, '🖼️', '["/assets/img/produtos/chaveiros-porta-photocard.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#8b5cf6', '#ff4d5e', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (3, 'Bandejas BT21', 'Bandejinhas ovais com rostinhos dos personagens BT21, ótimas para guardar anéis, clipes e pequenos objetos na mesa.', 19.9, 100, 2, '🧸', '["/assets/img/produtos/bandejas-bt21.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#3ddbf2', '#ff5c93', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (4, 'Porta-Óculos Ovelhinha', 'Suporte em formato de ovelhinha com lenço vermelho para apoiar seus óculos sem riscar. Ótimo para mesa de cabeceira ou escritório.', 29.9, 100, 2, '🐑', '["/assets/img/produtos/porta-oculos-ovelha.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ffffff', '#ff4d5e', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (6, 'Estátua Guerreira com Espada', 'Estátua colorida de personagem com jaqueta amarela, trança roxa e espada, impressa em várias cores e com base decorada. Peça de destaque para estante.', 180, 100, 1, '🗡️', '["/assets/img/produtos/estatua-guerreira.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ffd23a', '#8b5cf6', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (7, 'Grinch na Poltrona', 'Miniatura do Grinch sentado em uma poltrona capitonê vermelha, com acabamento detalhado. Perfeita para decoração de Natal.', 40, 100, 1, '🎄', '["/assets/img/produtos/grinch-poltrona.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#3ddbb7', '#ff4d5e', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (8, 'Bailarina Rosa', 'Escultura de bailarina em estilo low poly com saia em camadas e degradê de cores. Ótima para decorar mesa ou estante.', 35, 100, 1, '🩰', '["/assets/img/produtos/bailarina-rosa.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ff9ecb', '#9fd8ff', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (10, 'Dinossauros Equilibristas', 'Jogo de equilíbrio com base curva e dinossauros coloridos para empilhar sem deixar cair. Diversão para crianças e adultos.', 49.9, 100, 3, '🦖', '["/assets/img/produtos/dinossauros-equilibrio.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#3ddbb7', '#ffd23a', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (11, 'Garrafa Térmica JIN', 'Mini garrafão térmico rosa com nome gravado, canudo, plaquinha "Worldwide Handsome" e chaveiro de personagem. Peça fofa para colecionadores.', 35, 100, 2, '🥤', '["/assets/img/produtos/garrafa-termica-jin.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ff2f7a', '#ffffff', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (14, 'Leque BTS', 'Leque articulado impresso em 3D com detalhes em vermelho e borla, inspirado no universo do grupo. Peça de colecionador.', 25, 100, 10, '🪭', '["/assets/img/produtos/leque-bts.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#1a1a1a', '#ff4d5e', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (15, 'Dragão Preto', 'Escultura de dragão em preto metalizado com muitos detalhes em relevo. Serve como decoração ou porta-objetos.', 40, 100, 3, '🐉', '["/assets/img/produtos/dragao-preto.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#1a1a1a', '#4b6bff', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (16, 'Quadro Camisa de Time', 'Quadro com camisa do time em relevo 3D, com nome, número e patrocinadores. Personalizável para qualquer clube ou jogador.', 60, 100, 10, '🖼️', '["/assets/img/produtos/quadro-flamengo-paqueta.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ff4d5e', '#1a1a1a', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (18, 'Cooky BT21', 'Miniatura colecionável do Cooky, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.', 50, 100, 1, '🐰', '["/assets/img/bt21/cooky.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ff5c93', '#8b5cf6', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (20, 'Tata BT21', 'Miniatura colecionável do Tata, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.', 35, 100, 1, '❤️', '["/assets/img/bt21/tata.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ff4d5e', '#4b6bff', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (21, 'Chimmy BT21', 'Miniatura colecionável do Chimmy, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.', 35, 100, 1, '🐶', '["/assets/img/bt21/chimmy.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ffd23d', '#ffffff', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (22, 'Shooky BT21', 'Miniatura colecionável do Shooky, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.', 20, 100, 1, '🍪', '["/assets/img/bt21/shooky.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#b8742f', '#ffffff', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (23, 'Mang BT21', 'Miniatura colecionável do Mang, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.', 35, 100, 1, '🐴', '["/assets/img/bt21/mang.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#8b5cf6', '#3ddbf2', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (24, 'RJ BT21', 'Miniatura colecionável do RJ, da linha BT21, com jaqueta preta. Impressa em 3D pela Y3D Creations. Faz parte da promoção Coleção BT21.', 40, 100, 1, '🐑', '["/assets/img/bt21/rj.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ffffff', '#ffd23d', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (25, 'Coleção Completa BT21', 'Coleção completa BT21 com 7 personagens em miniatura, com jaqueta preta, por um preço promocional.', 250, 100, 1, '🧸', '["/assets/img/bt21/colecao-completa.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#8b5cf6', '#ff4fd8', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (29, 'Bowser', 'Miniatura do Bowser com casco e espinhos coloridos, impressa em 3D e pintada com detalhes.', 140, 100, 1, '🐢', '["/assets/img/produtos/bowser.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ffd23a', '#ff4d5e', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (30, 'Combo Personagens', 'Combo promocional com as quatro peças: Estátua Guerreira com Espada, Bowser, Grinch na Poltrona e Bailarina Rosa. As peças saem por R$ 395,00 compradas separadamente; no combo, você economiza R$ 46,00.', 349, 100, 1, '🎁', '["/assets/img/produtos/estatua-guerreira.jpg"]', '[]', '["Impressas em 3D pela Y3D Creations","Combo com 4 peças físicas"]', NULL, 0, '#8b5cf6', '#ffd23a', '["Combo com 4 peças físicas"]', 'Impressas em 3D pela Y3D Creations', 0),
  (31, 'Suporte de Controle Guerreiro', 'Suporte para controle de videogame em formato de guerreiro sombrio com sabre vermelho. Deixa seu controle em destaque e sempre à mão.', 45, 100, 2, '🎮', '["/assets/img/produtos/suporte-controle-guerreiro.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#1a1a1a', '#ff2f2f', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (32, 'Kit Porta-Lata Monster', 'Porta-lata em formato de caneca com alça e estampa de garras, acompanhado de tampa decorada e plaquinha com chaveiro de corrente. Tudo impresso em 3D.', 49.9, 100, 2, '🥤', '["/assets/img/produtos/porta-lata-monster.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ffffff', '#8b5cf6', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (33, 'Boneco Personalizado Bobblehead', 'Boneco estilo bobblehead personalizado, com cabelo, barba, roupa e nome gravado na base. Peça única, feita sob medida.', 120, 100, 10, '🧑', '["/assets/img/produtos/boneco-personalizado-kent.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#3ddbf2', '#1a1a1a', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0),
  (34, 'Chaveiros Power Ranger e Mini Peças', 'Chaveiros impressos em 3D de personagens e itens divertidos, como o Power Ranger vermelho, dinossauro, controle e cubo mágico.', 15, 100, 10, '🔑', '["/assets/img/produtos/chaveiros-power-ranger.jpg"]', '[]', '["Impressa em 3D pela Y3D Creations","Peça física"]', NULL, 0, '#ff2f2f', '#3ddbf2', '["Peça física"]', 'Impressa em 3D pela Y3D Creations', 0)
AS novo ON DUPLICATE KEY UPDATE
 nome=novo.nome, descricao=novo.descricao, preco=novo.preco, categoria_id=novo.categoria_id,
 emoji=novo.emoji, imagens=novo.imagens, detalhes=novo.detalhes, cor1=novo.cor1,
 cor2=novo.cor2, formatos=novo.formatos, tamanho=novo.tamanho, vendidos=novo.vendidos;


CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expira_em DATETIME NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reset_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_reset_expira (expira_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE IF NOT EXISTS avaliacoes_atendimento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL UNIQUE,
  usuario_id INT NOT NULL,
  nota TINYINT UNSIGNED NOT NULL,
  comentario VARCHAR(600) NOT NULL DEFAULT '',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_atendimento_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_atendimento_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT chk_atendimento_nota CHECK (nota BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
