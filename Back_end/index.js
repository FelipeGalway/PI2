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

    res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }  
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



