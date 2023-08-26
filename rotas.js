const express = require("express");

const { validarSenha } = require("../intermediario/intermediario");

const rotas = express();

const {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  saldo,
  consulta,
  Depositos,
  Saque,
  Transferencia,
} = require("../Controladores/controller");

rotas.get("/contas", validarSenha, listarContas); // http://localhost:3000/contas?validarSenha=Cubos123Bank/

rotas.post("/contas", criarConta); // http://localhost:3000/contas

rotas.put("/contas/:numeroConta/usuario", atualizarUsuario); // http://localhost:3000/contas/:numeroConta/usuario

rotas.delete("/contas/:numeroConta", excluirConta); // http://localhost:3000/contas/:numeroConta

rotas.get("/contas/saldo", saldo); // http://localhost:3000/contas/saldo?numero_conta=123&senha=123

rotas.get("/contas/extrato", consulta); // http://localhost:3000/contas/extrato?numero_conta=123&senha=123

rotas.post("/transacoes/depositar", Depositos); // http://localhost:3000/transacoes/depositar

rotas.post("/transacoes/sacar", Saque); // http://localhost:3000/transacoes/sacar

rotas.post("/transacoes/transferir", Transferencia); // http://localhost:3000/transacoes/transferir

module.exports = rotas;
