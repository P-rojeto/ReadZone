const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
const Usuario = require('./models/modelsUsuario');
const Livro = require('./models/modelsLivro'); 
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado com sucesso'))
.catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// Rotas de usuários
app.use('/api', userRoutes);

// ROTA: Listar livros
app.get('/livros', async (req, res) => {
  try {
    const livros = await Livro.find();
    res.json(livros);
  } catch (err) {
    console.error('Erro no GET /livros:', err);
    res.status(500).json({ erro: 'Erro ao buscar livros' });
  }
});

// ROTA: Cadastrar novo livro
app.post('/livros', async (req, res) => {
  try {
    const novoLivro = new Livro(req.body);
    await novoLivro.save();
    res.status(201).json({ mensagem: 'Livro cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar livro:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar livro' });
  }
});

// Início do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});