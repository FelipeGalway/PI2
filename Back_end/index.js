const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const imoveis = require('./imoveis.json'); 

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



