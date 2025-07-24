
const mongoose = require('mongoose');

const vendaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  livros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livro' }],
  data: { type: Date, default: Date.now },
  total: Number
});

module.exports = mongoose.model('Venda', vendaSchema);
