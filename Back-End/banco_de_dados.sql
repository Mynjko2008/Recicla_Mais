-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS recicla_plus;
USE recicla_plus;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    estado VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (LENGTH(senha) >= 8) -- Garantir que a senha tenha pelo menos 8 caracteres
);

-- Tabela de Categorias de Resíduos
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de Registros de Descarte
CREATE TABLE IF NOT EXISTS registros_descarte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL CHECK (quantidade > 0), -- Garantir que a quantidade seja positiva
    unidade ENUM('kg', 'unidade') NOT NULL,
    local_descarte VARCHAR(255) NOT NULL,
    data_descarte DATE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- View para Ranking de Descartes por Usuário
CREATE OR REPLACE VIEW ranking AS
SELECT 
    u.id AS usuario_id,
    u.nome,
    COALESCE(SUM(r.quantidade), 0) AS total_reciclado -- Usar COALESCE para tratar usuários sem descartes
FROM usuarios u
LEFT JOIN registros_descarte r ON u.id = r.usuario_id
GROUP BY u.id, u.nome
ORDER BY total_reciclado DESC;