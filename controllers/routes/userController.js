const Usuario = require('../models/modelsUsuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const segredo = process.env.JWT_SECRET;

async function registrar(req, res) {
  try {
    const { usuario, email, senha } = req.body;
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'E-mail já registrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({ usuario, email, senha: hash });
    await novoUsuario.save();

    res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no servidor ao registrar' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: usuario._id, email: usuario.email }, segredo, { expiresIn: '1h' });

    res.json({ mensagem: 'Login bem-sucedido!', token, usuario: usuario.usuario });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no servidor ao fazer login' });
  }
}

module.exports = { registrar, login };
                    