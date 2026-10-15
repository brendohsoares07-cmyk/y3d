-- Y3D Creations — dados iniciais (catálogo, categorias e máquinas).
-- Executado depois do schema.sql, só na primeira vez que o volume é criado.
SET NAMES utf8mb4;

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
