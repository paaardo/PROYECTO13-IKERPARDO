// routes/vehiculoRoutes.js
const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

// Ruta para crear un nuevo vehículo
router.post('/', vehiculoController.crearVehiculo);

// Ruta para obtener todos los vehículos
router.get('/', vehiculoController.obtenerVehiculos);

// Ruta para obtener un vehículo por ID
router.get('/:id', vehiculoController.obtenerVehiculoPorId);

// Ruta para actualizar un vehículo
router.put('/:id', vehiculoController.actualizarVehiculo);

// Ruta para eliminar un vehículo
router.delete('/:id', vehiculoController.eliminarVehiculo);

module.exports = router;
