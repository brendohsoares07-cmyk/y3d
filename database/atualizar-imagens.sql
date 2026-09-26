-- Y3D Creations — fotos novas dos produtos (para bancos JÁ criados; não apaga dados).
-- Só faz UPDATE com WHERE. Aplique uma vez no MySQL do projeto.
SET NAMES utf8mb4;

UPDATE produtos SET imagens = '["/img/produtos/dragao-artistico.jpg"]' WHERE id = 1 AND nome = 'Dragão Ancião';
UPDATE produtos SET imagens = '["/img/produtos/boneco-articulado.jpg"]' WHERE id = 2 AND nome = 'Guerreiro Saiyajin';
UPDATE produtos SET imagens = '["/img/produtos/casa-medieval.jpg"]' WHERE id = 5 AND nome = 'Casa Medieval';
UPDATE produtos SET imagens = '["/img/produtos/emblemas-army.png", "/img/produtos/expositor-colecao.jpg"]' WHERE id = 15 AND nome = 'Emblemas ARMY Personalizados';
UPDATE produtos SET imagens = '["/img/produtos/quadro-camisa.png", "/img/produtos/quadro-personalizado.jpg"]' WHERE id = 16 AND nome = 'Quadro Camisa Personalizado';
UPDATE produtos SET imagens = '["/img/produtos/quadro-harry-potter.png", "/img/produtos/quadro-retrato.jpg"]' WHERE id = 18 AND nome = 'Quadro Retrato Gravado a Laser';
UPDATE produtos SET imagens = '["/img/produtos/miniaturas-personagens.png", "/img/produtos/miniatura-decorativa.jpg"]' WHERE id = 19 AND nome = 'Miniaturas Geek Colecionáveis';
UPDATE produtos SET imagens = '["/img/produtos/suportes-controles.png", "/img/produtos/suporte-controle-gamer.jpg"]' WHERE id = 20 AND nome = 'Suporte para Controle Gamer';
UPDATE produtos SET imagens = '["/img/produtos/estatuetas.png", "/img/produtos/estatua-anime.jpg"]' WHERE id = 23 AND nome = 'Coleção de Estátuas Decorativas';
UPDATE produtos SET imagens = '["/img/produtos/letreiros-logos.png", "/img/produtos/quadro-3d-luz.jpg"]' WHERE id = 24 AND nome = 'Letreiro Y3D Personalizado';
UPDATE produtos SET imagens = '["/img/produtos/chaveiros.png", "/img/produtos/chaveiro-stitch-azul.jpg", "/img/produtos/chaveiro-stitch-preto.jpg"]' WHERE id = 25 AND nome = 'Chaveiros Temáticos';
