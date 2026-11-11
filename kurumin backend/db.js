const mysql = require('mysql2');

// Conexão com a base de dados mydb criada no HeidiSQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Teu utilizador do MySQL (padrão é root)
  password: '',      // Tua senha (deixa vazio se for padrão do XAMPP/Wamp)
  database: 'mydb'   // A base de dados onde estão as tuas tabelas
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados mydb com sucesso!');
});

module.exports = db;