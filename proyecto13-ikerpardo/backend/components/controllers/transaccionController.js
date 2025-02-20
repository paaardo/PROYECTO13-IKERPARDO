// controllers/transaccionController.js
const Transaccion = require("../models/Transaccion");
const Cliente = require("../models/Cliente"); // Importar el modelo Cliente
const Vehiculo = require("../models/Vehiculo"); // Importar el modelo Vehiculo

// Crear una nueva transacción
exports.crearTransaccion = async (req, res) => {
  try {
    const nuevaTransaccion = new Transaccion(req.body);
    const transaccionGuardada = await nuevaTransaccion.save();

    // 1. Actualizar el cliente agregando la transacción al campo "compras"
    await Cliente.findByIdAndUpdate(
      req.body.cliente,
      { $push: { compras: transaccionGuardada._id } },
      { new: true }
    );

    await Vehiculo.findByIdAndUpdate(
      req.body.vehiculo,
      { estadoVehiculo: "Vendido" },
      { new: true }
    );

    res.status(201).json(transaccionGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la transacción", error });
  }
};

// Obtener todas las transacciones
exports.obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.find()
      .populate("vehiculo")
      .populate("cliente");
    res.json(transacciones);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener las transacciones", error });
  }
};

// Obtener una transacción por ID
exports.obtenerTransaccionPorId = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id)
      .populate("vehiculo")
      .populate("cliente");
    if (!transaccion)
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la transacción", error });
  }
};

// Actualizar una transacción
exports.actualizarTransaccion = async (req, res) => {
  try {
    const transaccionAnterior = await Transaccion.findById(req.params.id);

    if (!transaccionAnterior) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }

    // Si el vehículo ha cambiado, restauramos el estado del vehículo anterior
    if (transaccionAnterior.vehiculo.toString() !== req.body.vehiculo) {
      // Restaurar el estado del vehículo anterior
      await Vehiculo.findByIdAndUpdate(transaccionAnterior.vehiculo, {
        estadoVehiculo: "Disponible",
      });

      // Actualizar el estado del nuevo vehículo a "Vendido"
      await Vehiculo.findByIdAndUpdate(req.body.vehiculo, {
        estadoVehiculo: "Vendido",
      });
    }

    // Actualizar la transacción con los nuevos datos
    const transaccionActualizada = await Transaccion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(transaccionActualizada);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar la transacción", error });
  }
};

// Eliminar una transacción
exports.eliminarTransaccion = async (req, res) => {
  try {
    // Buscar la transacción que se va a eliminar
    const transaccionEliminada = await Transaccion.findById(req.params.id);
    if (!transaccionEliminada)
      return res.status(404).json({ mensaje: "Transacción no encontrada" });

    // 1. Eliminar la transacción del campo "compras" del cliente
    await Cliente.findByIdAndUpdate(transaccionEliminada.cliente, {
      $pull: { compras: transaccionEliminada._id },
    });

    // 2. Cambiar el estado del vehículo a "Disponible"
    await Vehiculo.findByIdAndUpdate(
      transaccionEliminada.vehiculo,
      { estadoVehiculo: "Disponible" }, // Asegurar que usamos el mismo campo que en crearTransaccion
      { new: true }
    );

    // 3. Finalmente, eliminar la transacción de la base de datos
    await Transaccion.findByIdAndDelete(req.params.id);

    res.json({ mensaje: "Transacción eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar la transacción", error });
  }
};
