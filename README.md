# ⚡ Eletro Kurumin - Sistema de Gestão de Estoque

O **Eletro Kurumin** é uma aplicação Full-Stack para gestão e controle de estoque de componentes eletrónicos. O sistema permite cadastrar, listar, editar e remover componentes, além de gerir categorias e movimentações de estoque.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS) com chamadas assíncronas via `fetch`
- **Backend:** Node.js, Express.js, CORS
- **Banco de Dados:** MySQL (gerido via MariaDB / HeidiSQL / XAMPP)
- **Biblioteca de Conexão:** `mysql2`

---

## 📁 Estrutura de Tabelas (MySQL)

O sistema utiliza a base de dados `mydb` com a seguinte estrutura relacional:

```sql
CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE componente (
    id_componente INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_componente_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE movimentacao (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_componente INT NOT NULL,
    id_usuario INT NOT NULL,
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(20) NOT NULL,
    quantidade INT NOT NULL,
    justificativa TEXT,
    CONSTRAINT fk_movimentacao_componente FOREIGN KEY (id_componente) REFERENCES componente(id_componente)
);

-- Categoria inicial obrigatória
INSERT INTO categoria (id_categoria, nome, descricao) VALUES (1, 'Geral', 'Categoria padrao');

