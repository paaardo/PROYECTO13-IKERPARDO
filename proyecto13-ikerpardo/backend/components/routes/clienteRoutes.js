const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Ruta para crear un nuevo cliente
router.post('/', verificarToken, verificarRol('admin'), clienteController.crearCliente);

// Ruta para obtener todos los clientes
router.get('/', verificarToken, clienteController.obtenerClientes);

// Ruta para obtener un cliente por ID
router.get('/:id', verificarToken, clienteController.obtenerClientePorId);

// Ruta para actualizar un cliente
router.put('/:id', verificarToken, verificarRol('admin'), clienteController.actualizarCliente);

// Ruta para eliminar un cliente
router.delete('/:id', verificarToken, verificarRol('admin'), clienteController.eliminarCliente);

module.exports = router;
