// routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Ruta para crear un nuevo cliente
router.post('/', clienteController.crearCliente);

// Ruta para obtener todos los clientes
router.get('/', clienteController.obtenerClientes);

// Ruta para obtener un cliente por ID
router.get('/:id', clienteController.obtenerClientePorId);

// Ruta para actualizar un cliente
router.put('/:id', clienteController.actualizarCliente);

// Ruta para eliminar un cliente
router.delete('/:id', clienteController.eliminarCliente);

module.exports = router;
