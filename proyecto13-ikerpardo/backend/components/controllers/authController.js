// controllers/authController.js
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const nuevoUsuario = new Usuario({ nombre, email, password, rol });
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar usuario', error });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });
        
        if (!usuario || !(await usuario.verificarPassword(password))) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const rol = usuario.rol;
        res.json({ token, rol });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
    }
};

