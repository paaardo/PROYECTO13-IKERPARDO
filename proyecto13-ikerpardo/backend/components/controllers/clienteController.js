const Cliente = require("../models/Cliente");
const Vehiculo = require("../models/Vehiculo");
const Usuario = require("../models/Usuario");
// Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el cliente", error });
  }
};

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    let clientes;

    if (req.accesoLimitado) {
      // Solo devolver nombre, apellido y compras para "Usuario"
      clientes = await Cliente.find().select("nombre apellido compras");
    } else {
      // Para "Admin" se devuelve toda la información
      clientes = await Cliente.find();
    }

    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los clientes", error });
  }
};

// Obtener un cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente)
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el cliente", error });
  }
};

// Actualizar un cliente
exports.actualizarCliente = async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!clienteActualizado)
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el cliente", error });
  }
};

// Eliminar un cliente
exports.eliminarCliente = async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteEliminado)
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el cliente", error });
  }
};

// Se añade para que se pueda reservar y cancelar un vehiculo desde el login de un usuario
// Reservar un vehiculo (el usuario puede tener solo uno reservado)
exports.reservarVehiculo = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    if (usuario.reservado) {
      return res.status(400).json({ mensaje: "Ya tienes un coche reservado" });
    }

    const vehiculo = await Vehiculo.findById(req.params.vehiculoId);
    if (!vehiculo || vehiculo.estadoVehiculo !== "Disponible") {
      return res
        .status(400)
        .json({ mensaje: "El vehículo no está disponible para reservar" });
    }

    vehiculo.estadoVehiculo = "Reservado";
    await vehiculo.save();

    usuario.reservado = vehiculo._id;
    await usuario.save();

    res.json({ mensaje: "Vehículo reservado correctamente", vehiculo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al reservar el vehículo", error });
  }
};

// Cancelar la reserva de un vehiculo
exports.cancelarReserva = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario || !usuario.reservado) {
      return res
        .status(400)
        .json({ mensaje: "No tienes ninguna reserva activa" });
    }

    const vehiculo = await Vehiculo.findById(usuario.reservado);
    if (vehiculo) {
      vehiculo.estadoVehiculo = "Disponible";
      await vehiculo.save();
    }

    usuario.reservado = null;
    await usuario.save();

    res.status(200).json({ mensaje: 'Reserva cancelada correctamente', vehiculoCancelado: vehiculo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cancelar la reserva", error });
  }
};
