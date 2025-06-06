const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },
    reservado: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo', default: null }
});

usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

usuarioSchema.methods.verificarPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);