const Vehiculo = require('../models/Vehiculo');

// Crear un nuevo vehiculo
exports.crearVehiculo = async (req, res) => {
    try {
        const nuevoVehiculo = new Vehiculo(req.body);
        const vehiculoGuardado = await nuevoVehiculo.save();
        res.status(201).json(vehiculoGuardado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el vehículo", error });
    }
};

// Obtener todos los vehiculos
exports.obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find();
        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los vehículos", error });
    }
};

// Obtener un vehiculo por ID
exports.obtenerVehiculoPorId = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findById(req.params.id);
        if (!vehiculo) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el vehículo", error });
    }
};

// Actualizar un vehiculo
exports.actualizarVehiculo = async (req, res) => {
    try {
        const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehiculoActualizado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        res.json(vehiculoActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el vehículo", error });
    }
};

// Eliminar un vehiculo
exports.eliminarVehiculo = async (req, res) => {
    try {
        const vehiculoEliminado = await Vehiculo.findByIdAndDelete(req.params.id);
        if (!vehiculoEliminado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
        res.json({ mensaje: "Vehículo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el vehículo", error });
    }
};
