const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo', required: true },
  fecha: { type: Date, default: Date.now },
  total: { type: Number, required: true },
});

module.exports = mongoose.model('Transaccion', transaccionSchema);
