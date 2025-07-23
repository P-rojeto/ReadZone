const express = require('express');
const router = express.Router();
const conexao = require('../db');
const bcrypt = require('bcrypt');

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  conexao.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (results.length === 0) return res.status(401).json({ erro: 'E-mail ou senha inválidos' });

    const user = results[0];
    bcrypt.compare(senha, user.senha, (err, result) => {
      if (result) {
        res.json({ mensagem: 'Login bem-sucedido', usuario: user.usuario });
      } else {
        res.status(401).json({ erro: 'E-mail ou senha inválidos' });
      }
    });
  });
});

// Registro
router.post('/registro', async (req, res) => {
  const { usuario, email, senha } = req.body;

  const hashedSenha = await bcrypt.hash(senha, 10);

  conexao.query('INSERT INTO usuarios (usuario, email, senha) VALUES (?, ?, ?)', [usuario, email, hashedSenha], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ erro: 'E-mail já cadastrado!' });
      }
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

module.exports = router;
