const mongoose = require('mongoose');

const vendaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  livroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venda', vendaSchema);