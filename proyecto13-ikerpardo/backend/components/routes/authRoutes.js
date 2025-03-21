const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registrar un nuevo usuario
router.post('/registrar', authController.registrar);

// Ruta para iniciar sesion
router.post('/login', authController.login);

module.exports = router;
