// routes/transaccionRoutes.js
const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Ruta para crear una nueva transacción
router.post('/', verificarToken, verificarRol('admin'), transaccionController.crearTransaccion);

// Ruta para obtener todas las transacciones
router.get('/', transaccionController.obtenerTransacciones);

// Ruta para obtener una transacción por ID
router.get('/:id', transaccionController.obtenerTransaccionPorId);

// Ruta para actualizar una transacción
router.put('/:id', verificarToken, verificarRol('admin'), transaccionController.actualizarTransaccion);

// Ruta para eliminar una transacción
router.delete('/:id', verificarToken, verificarRol('admin'), transaccionController.eliminarTransaccion);

module.exports = router;
