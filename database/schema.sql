-- Y3D Creations — criação das tabelas (estrutura do banco).
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
