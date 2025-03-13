// routes/vehiculoRoutes.js
const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Ruta para crear un nuevo vehículo
router.post('/', verificarToken, verificarRol('admin'), vehiculoController.crearVehiculo);

// Ruta para obtener todos los vehículos
router.get('/', vehiculoController.obtenerVehiculos);

// Ruta para obtener un vehículo por ID
router.get('/:id', vehiculoController.obtenerVehiculoPorId);

// Ruta para actualizar un vehículo
router.put('/:id', verificarToken, verificarRol('admin'), vehiculoController.actualizarVehiculo);

// Ruta para eliminar un vehículo
router.delete('/:id', verificarToken, verificarRol('admin'), vehiculoController.eliminarVehiculo);

module.exports = router;
