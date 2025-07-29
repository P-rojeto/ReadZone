// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importações de rotas e modelos
const userRoutes = require('./routes/user'); // Caminho completo
const Livro = require('./models/modelsLivro'); // Caminho completo

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // Ignorado desde o driver v4
  useUnifiedTopology: true // Também ignorado no v4
})
.then(() => console.log('✅ MongoDB conectado com sucesso'))
.catch((err) => console.error('❌ Erro ao conectar no MongoDB:', err));

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public'))); // Caminho corrigido

// Serve index.html por padrão
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rotas de autenticação
app.use('/', userRoutes);

// Rota para listar livros
app.get('/livros', async (req, res) => {
  try {
    const livros = await Livro.find();
    res.json(livros);
  } catch (err) {
    console.error('Erro ao buscar livros:', err);
    res.status(500).json({ erro: 'Erro ao buscar livros' });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
