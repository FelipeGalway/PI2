const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const imoveis = require('./imoveis.json');
const sql = require('mssql/msnodesqlv8')

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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



