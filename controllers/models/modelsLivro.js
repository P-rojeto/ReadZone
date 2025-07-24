const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  preco: { type: Number, required: true },
  imagem: { type: String }, // URL da capa do livro
  descricao: { type: String },
  categoria: { type: String }
});

module.exports = mongoose.model('Livro', bookSchema);
