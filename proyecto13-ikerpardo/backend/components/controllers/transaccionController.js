// controllers/transaccionController.js
const Transaccion = require('../models/Transaccion');

// Crear una nueva transacción
exports.crearTransaccion = async (req, res) => {
    try {
        const nuevaTransaccion = new Transaccion(req.body);
        const transaccionGuardada = await nuevaTransaccion.save();
        res.status(201).json(transaccionGuardada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la transacción", error });
    }
};

// Obtener todas las transacciones
exports.obtenerTransacciones = async (req, res) => {
    try {
        const transacciones = await Transaccion.find().populate('vehiculo').populate('cliente');
        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las transacciones", error });
    }
};

// Obtener una transacción por ID
exports.obtenerTransaccionPorId = async (req, res) => {
    try {
        const transaccion = await Transaccion.findById(req.params.id).populate('vehiculo').populate('cliente');
        if (!transaccion) return res.status(404).json({ mensaje: "Transacción no encontrada" });
        res.json(transaccion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la transacción", error });
    }
};

// Actualizar una transacción
exports.actualizarTransaccion = async (req, res) => {
    try {
        const transaccionActualizada = await Transaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaccionActualizada) return res.status(404).json({ mensaje: "Transacción no encontrada" });
        res.json(transaccionActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la transacción", error });
    }
};

// Eliminar una transacción
exports.eliminarTransaccion = async (req, res) => {
    try {
        const transaccionEliminada = await Transaccion.findByIdAndDelete(req.params.id);
        if (!transaccionEliminada) return res.status(404).json({ mensaje: "Transacción no encontrada" });
        res.json({ mensaje: "Transacción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la transacción", error });
    }
};
