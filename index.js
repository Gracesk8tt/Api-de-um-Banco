// Importar o framework para usar
const express = require("express");
const rotas = require("./Rotas/rotas");

//Usando o framework
const app = express();

//definir o uso do json
app.use(express.json());

app.use(rotas);

// app rodando
app.listen(3000, () => {
  console.log(
    ` Servidor rodando na porta http://localhost:3000 sucesso! 🚀🚀🚀`
  );
});
