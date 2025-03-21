const Cliente = require('../models/Cliente');

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
        if (!cliente) return res.status(404).json({ mensaje: "Cliente no encontrado" });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el cliente", error });
    }
};

// Actualizar un cliente
exports.actualizarCliente = async (req, res) => {
    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!clienteActualizado) return res.status(404).json({ mensaje: "Cliente no encontrado" });
        res.json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el cliente", error });
    }
};

// Eliminar un cliente
exports.eliminarCliente = async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
        if (!clienteEliminado) return res.status(404).json({ mensaje: "Cliente no encontrado" });
        res.json({ mensaje: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el cliente", error });
    }
};
