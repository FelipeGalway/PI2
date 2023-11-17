const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const imoveis = require('./imoveis.json');
const sql = require('mssql/msnodesqlv8')
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

const pool = new sql.ConnectionPool({
  database: 'PI',
  server: 'localhost',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
})

pool.connect().then(() => {  
  pool.request().query('select 1 as number', (err, result) => {
        console.dir(result)
    })
})

app.use(express.json());
app.use(express.static(path.join(__dirname, "../Front_end")));

app.get('/buscar-imoveis', (req, res) => {
  const { location, propertyType, priceRange, priceRangeMax } = req.query;

  const resultados = imoveis.filter((imovel) => {
    return (
      (location ? imovel.endereco.toLowerCase().includes(location.toLowerCase()) : true) &&
      (propertyType ? imovel.tipo === propertyType : true) &&
      (priceRange ? imovel.preco >= priceRange : true) &&
      (priceRangeMax ? imovel.preco <= priceRangeMax : true)
    );
  });

  res.json(resultados); 
});

app.post('/cadastrar-usuario', async (req, res) => {
  try {
    const { name, username, cpf, email, address, tel, password } = req.body;

    const query =
      "INSERT INTO Usuarios (nome, nome_usuario, cpf, email, endereco, telefone, senha) VALUES (@nome, @nome_usuario, @cpf, @email, @endereco, @telefone, @senha)";

    const request = pool.request();
    request.input('nome', sql.VarChar, name);
    request.input('nome_usuario', sql.VarChar, username);
    request.input('cpf', sql.VarChar, cpf);
    request.input('email', sql.VarChar, email);
    request.input('endereco', sql.VarChar, address);
    request.input('telefone', sql.VarChar, tel);
    request.input('senha', sql.VarChar, password);

    const result = await request.query(query);

    res.status(200).json({ message: 'Usuário(a) cadastrado(a) com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário(a).' });
  }  
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const query =
      "SELECT * FROM Usuarios WHERE nome_usuario = @nome_usuario AND senha = @senha";

    const request = pool.request();
    request.input('nome_usuario', sql.VarChar, username);
    request.input('senha', sql.VarChar, password);

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.status(200).json({ message: `Bem-vindo(a), ${user.nome_usuario}!` });
    } else {
      res.status(401).json({ error: 'Usuário(a) ou senha inválidos.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
});

app.post('/atualizar-usuario', async (req, res) => {
  try {
    const { nameAtualizacao, usernameAtualizacao, cpfAtualizacao, emailAtualizacao, addressAtualizacao, telAtualizacao, passwordAtualizacao } = req.body;

    const query =
      "UPDATE Usuarios SET nome = @nome, nome_usuario = @nome_usuario, email = @email, endereco = @endereco, telefone = @telefone, senha = @senha WHERE cpf = @cpf";

    const request = pool.request();
    request.input('nome', sql.VarChar, nameAtualizacao);
    request.input('nome_usuario', sql.VarChar, usernameAtualizacao);
    request.input('cpf', sql.VarChar, cpfAtualizacao);
    request.input('email', sql.VarChar, emailAtualizacao);
    request.input('endereco', sql.VarChar, addressAtualizacao);
    request.input('telefone', sql.VarChar, telAtualizacao);
    request.input('senha', sql.VarChar, passwordAtualizacao);    

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Cadastro atualizado com sucesso!' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar cadastro.' });
  }
});

app.post('/excluir-usuario', async (req, res) => {
  try {
    const { cpfExclusao } = req.body;

    const query = "DELETE FROM Usuarios WHERE cpf = @cpf";

    const request = pool.request();
    request.input('cpf', sql.VarChar, cpfExclusao);

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Conta excluída com sucesso!' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir conta.' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



