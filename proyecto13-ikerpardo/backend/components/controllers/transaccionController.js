const Transaccion = require("../models/Transaccion");
const Cliente = require("../models/Cliente");
const Vehiculo = require("../models/Vehiculo");

// Crear una nueva transaccion
exports.crearTransaccion = async (req, res) => {
  try {
    const nuevaTransaccion = new Transaccion(req.body);
    const transaccionGuardada = await nuevaTransaccion.save();

    // 1. Actualizar el cliente agregando la transaccion al campo "compras"
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

// Obtener una transaccion por ID
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

    // Si el vehiculo ha cambiado, restauramos el estado del vehiculo anterior
    if (transaccionAnterior.vehiculo.toString() !== req.body.vehiculo) {
      // Restaurar el estado del vehiculo anterior
      await Vehiculo.findByIdAndUpdate(transaccionAnterior.vehiculo, {
        estadoVehiculo: "Disponible",
      });

      // Actualizar el estado del nuevo vehiculo a "Vendido"
      await Vehiculo.findByIdAndUpdate(req.body.vehiculo, {
        estadoVehiculo: "Vendido",
      });
    }

    // Actualizar la transaccion con los nuevos datos
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

// Eliminar una transaccion
exports.eliminarTransaccion = async (req, res) => {
  try {
    // Buscar la transaccion que se va a eliminar
    const transaccionEliminada = await Transaccion.findById(req.params.id);
    if (!transaccionEliminada)
      return res.status(404).json({ mensaje: "Transacción no encontrada" });

    // Eliminar la transacción del campo "compras" del cliente
    await Cliente.findByIdAndUpdate(transaccionEliminada.cliente, {
      $pull: { compras: transaccionEliminada._id },
    });

    // Cambiar el estado del vehiculo a "Disponible"
    await Vehiculo.findByIdAndUpdate(
      transaccionEliminada.vehiculo,
      { estadoVehiculo: "Disponible" },
      { new: true }
    );

    // Finalmente, eliminar la transaccion de la base de datos
    await Transaccion.findByIdAndDelete(req.params.id);

    res.json({ mensaje: "Transacción eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar la transacción", error });
  }
};
