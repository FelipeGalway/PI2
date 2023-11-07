const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const imoveis = require('./imoveis.json'); // Importe o arquivo JSON com os imóveis

app.use(express.json());
app.use(express.static(path.join(__dirname, "../Front_end")));

// Rota para tratar a busca de imóveis
app.get('/buscar-imoveis', (req, res) => {
  const { location, propertyType, priceRange, priceRangeMax } = req.query;

  // Filtre os imóveis com base nos parâmetros da busca
  const resultados = imoveis.filter((imovel) => {
    return (
      (location ? imovel.endereco.toLowerCase().includes(location.toLowerCase()) : true) &&
      (propertyType ? imovel.tipo === propertyType : true) &&
      (priceRange ? imovel.preco >= priceRange : true) &&
      (priceRangeMax ? imovel.preco <= priceRangeMax : true)
    );
  });

  res.json(resultados); // Retorne os resultados como JSON
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



