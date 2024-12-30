// models/Cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  direccion: { type: String },
  compras: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaccion' }],
});

module.exports = mongoose.model('Cliente', clienteSchema);
