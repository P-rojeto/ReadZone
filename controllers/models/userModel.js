const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', userSchema);
