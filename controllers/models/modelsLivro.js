const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  imagem: {
    type: String,
    required: false
  },
  descricao: {
    type: String,
    required: false
  },
  categoria: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Livro', livroSchema);