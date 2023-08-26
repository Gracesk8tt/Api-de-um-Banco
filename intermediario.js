const validarSenha = (req, res, next) => {
  const { senha } = req.query;

  if (senha !== "Cubos123Bank") {
    return res.status(401).json({ mensagem: "Senha está incorreta" });
  }
  next();
};

module.exports = {
  validarSenha,
};
