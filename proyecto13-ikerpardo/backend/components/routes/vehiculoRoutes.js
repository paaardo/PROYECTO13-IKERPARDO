const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Ruta para crear un nuevo vehiculo
router.post('/', verificarToken, verificarRol('admin'), vehiculoController.crearVehiculo);

// Ruta para obtener todos los vehiculos
router.get('/', vehiculoController.obtenerVehiculos);

// Ruta para obtener un vehiculo por ID
router.get('/:id', vehiculoController.obtenerVehiculoPorId);

// Ruta para actualizar un vehiculo
router.put('/:id', verificarToken, verificarRol('admin'), vehiculoController.actualizarVehiculo);

// Ruta para eliminar un vehiculo
router.delete('/:id', verificarToken, verificarRol('admin'), vehiculoController.eliminarVehiculo);

module.exports = router;
