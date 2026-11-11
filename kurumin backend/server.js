const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rota de Teste
app.get('/', (req, res) => {
  res.send('API Eletro Kurumin rodando!');
});

// 1. LOGIN (AUTENTICAÇÃO)
app.post('/auth/login', (req, res) => {
  const { email, senha } = req.body;
  if (email === 'admin@kurumin.com' && senha === '123456') {
    return res.json({ message: 'Login realizado com sucesso!', token: 'token-valido-123' });
  }
  return res.status(401).json({ message: 'E-mail ou senha inválidos' });
});

// 2. LISTAR COMPONENTES (READ)
app.get('/componentes', (req, res) => {
  const sql = `
    SELECT c.id_componente, c.nome, c.descricao, c.preco, c.quantidade_estoque, c.CATEGORIA_id_categoria
    FROM componente c`;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao listar componentes:', err);
      return res.status(500).json(err);
    }
    return res.json(results);
  });
});

// 3. CADASTRAR COMPONENTE (CREATE)
app.post('/componentes', (req, res) => {
  const { id_categoria, id_usuario, nome, descricao, preco, quantidade_estoque } = req.body;
  
  const sql = `INSERT INTO componente (CATEGORIA_id_categoria, id_usuario, nome, descricao, preco, quantidade_estoque) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [id_categoria || 1, id_usuario || 1, nome, descricao, preco, quantidade_estoque], (err, result) => {
    if (err) {
      console.error('Erro ao inserir componente:', err);
      return res.status(500).json(err);
    }
    return res.status(201).json({ id: result.insertId, message: 'Componente cadastrado com sucesso!' });
  });
});

// 4. ATUALIZAR COMPONENTE (UPDATE)
app.put('/componentes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, quantidade_estoque, id_categoria } = req.body;
  const sql = `UPDATE componente SET nome = ?, descricao = ?, preco = ?, quantidade_estoque = ?, CATEGORIA_id_categoria = ? WHERE id_componente = ?`;

  db.query(sql, [nome, descricao, preco, quantidade_estoque, id_categoria || 1, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar componente:', err);
      return res.status(500).json(err);
    }
    return res.json({ message: 'Componente atualizado com sucesso!' });
  });
});

// 5. APAGAR COMPONENTE (DELETE)
app.delete('/componentes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM componente WHERE id_componente = ?', [id], (err) => {
    if (err) {
      console.error('Erro ao eliminar componente:', err);
      return res.status(500).json(err);
    }
    return res.json({ message: 'Componente removido com sucesso!' });
  });
});

// 6. RELATÓRIO DE ESTOQUE (VALOR TOTAL)
app.get('/relatorios/estoque', (req, res) => {
  const sql = `SELECT id_componente, nome, descricao, preco, quantidade_estoque, (quantidade_estoque * preco) AS valor_total_item FROM componente`;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro no relatório:', err);
      return res.status(500).json(err);
    }
    
    const valorTotalEstoque = results.reduce((acc, item) => acc + parseFloat(item.valor_total_item || 0), 0);
    
    return res.json({
      componentes: results,
      valor_total_estoque: valorTotalEstoque.toFixed(2)
    });
  });
});

// Inicialização do Servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');
});