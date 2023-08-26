let {
  contas,
  depositos,
  saques,
  transferencias,
} = require("../BancodeDados/bancodedados");
const dateFns = require("date-fns");
let numero = 1;

//lista contas bancárias
const listarContas = (req, res) => {
  return res.status(200).json(contas);
};

function encontrarConta(id) {
  const encontrarConta = contas.find((conta) => conta.numero === Number(id));
  return encontrarConta;
}
function encontrarCpf(cpf) {
  const encontrarCpf = contas.find((conta) => conta.usuario.cpf === cpf);
  return encontrarCpf;
}

function encontrarEmail(email) {
  const encontrarEmail = contas.find((conta) => conta.usuario.email === email);
  return encontrarEmail;
}

module.exports = {
  encontrarEmail,
  encontrarCpf,
  encontrarConta,
};

//criar conta

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  contas.push({
    numero: numero++,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  });

  res.status(201).send();
};

//  atualizar usuário

const atualizarUsuario = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  let usuario = contas.find((usuario) => {
    return usuario.numero === Number(numeroConta);
  });

  if (!usuario) {
    return res.status(404).send({ mensagem: "Usuário não encontrado!" });
  }

  usuario.usuario = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  };

  res.status(204).send();
};

// Excluir Conta

const excluirConta = (req, res) => {
  const { numeroConta } = req.params;

  if (isNaN(numeroConta)) {
    return res.status(400).json({ mensagem: "Número de conta inválido." });
  }

  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  });
  if (!conta) {
    return res.status(404).send({ mensagem: "Usuário não encontrado!" });
  }

  if (conta.saldo !== 0) {
    return res
      .status(400)
      .send({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }

  contas = contas.filter((conta) => {
    return conta.numero !== Number(numeroConta);
  });

  res.status(204).send();
};

// Saldo

function saldo(req, res) {
  const { numero_conta } = req.query;

  const conta = contas.find((conta) => conta.numero === Number(numero_conta));

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada." });
  }

  return res.status(200).json({ saldo: conta.saldo });
}

// deposito

function Depositos(request, response) {
  const { numero_conta, valor } = request.body;

  const contaEncontrada = contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );

  if (!numero_conta || !valor) {
    return response
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }
  if (!contaEncontrada) {
    return response.status(400).json({ mensagem: "Conta não encontrada." });
  }
  if (valor <= 0) {
    return response.status(400).json({ mensagem: "Valor inválido." });
  }

  contaEncontrada.saldo += valor;

  depositos.push({
    data: dateFns.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta,
    valor: contaEncontrada.saldo,
  });

  return response.status(201).send();
}

// Saque

function Saque(request, response) {
  const { numero_conta, valor, senha } = request.body;

  if (!(numero_conta && valor && senha)) {
    return response.status(400).json({
      mensagem: "O número da conta, o valor e a senha são obrigatórios!",
    });
  }

  const validacaodaConta = contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );

  if (!validacaodaConta) {
    return response.status(400).json({ mensagem: "Conta não encontrada." });
  }

  if (validacaodaConta.usuario.senha !== senha) {
    return response.status(400).json({ mensagem: "Senha inválida." });
  }

  if (valor <= 0) {
    return response.status(400).json({ mensagem: "Valor inválido." });
  }

  if (validacaodaConta.saldo < valor) {
    return response.status(400).json({ mensagem: "Saldo insuficiente." });
  }

  validacaodaConta.saldo -= valor;

  saques.push({
    data: new Date(),
    data: dateFns.format(new Date(), "yyy-MM-dd HH:mm:ss"),
    numero_conta,
    valor: validacaodaConta.saldo - valor,
  });

  return response.status(201).send();
}

function Transferencia(request, response) {
  const { numero_conta_inicial, numero_conta_final, valor, senha } =
    request.body;

  if (!(numero_conta_inicial && numero_conta_final && valor && senha)) {
    return response.status(400).json({
      mensagem:
        "O número da conta inicial e o número da conta de final, o valor e a senha são obrigatórios!",
    });
  }

  const containicial = contas.find(
    (conta) => conta.numero === Number(numero_conta_inicial)
  );
  const contafinal = contas.find(
    (conta) => conta.numero === Number(numero_conta_final)
  );

  if (!containicial) {
    return response
      .status(400)
      .json({ mensagem: "Conta de origem não encontrada." });
  }

  if (!contafinal) {
    return response
      .status(400)
      .json({ mensagem: "Conta de destino não encontrada." });
  }

  if (containicial.usuario.senha !== senha) {
    return response.status(400).json({ mensagem: "Senha inválida." });
  }

  if (valor <= 0) {
    return response.status(400).json({ mensagem: "Valor inválido." });
  }

  if (containicial.saldo < valor) {
    return response.status(400).json({ mensagem: "Saldo insuficiente." });
  }

  containicial.saldo -= valor;
  contafinal.saldo += valor;

  transferencias.push({
    data: new Date(),
    data: dateFns.format(new Date(), "yyy-MM-dd HH:mm:ss"),
    numero_conta_inicial,
    numero_conta_final,
    valor,
  });

  return response.status(201).send();
}
//Extrato

function consulta(req, res) {
  const { numero_conta } = req.query;
  const registroTotais = {
    depositosTotais: depositos.filter((id) => {
      return id.numero_conta === numero_conta;
    }),
    saquesTotais: saques.filter((id) => {
      return id.numero_conta === numero_conta;
    }),
    TransferenciasTotais: transferencias.filter((id) => {
      return id.numero_conta_inicio === Number(numero_conta);
    }),
  };
  transferencias.push(registroTotais);
  return res.status(200).json(transferencias);
}

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  saldo,
  Depositos,
  Saque,
  Transferencia,
  consulta,
};
