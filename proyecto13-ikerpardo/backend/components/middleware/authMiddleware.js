// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Verificar token
exports.verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ mensaje: 'Acceso denegado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};

// Verificar rol con excepción para GET clientes
exports.verificarRol = (rol) => (req, res, next) => {
    if (req.usuario.rol === "Usuario" && req.method === "GET" && req.originalUrl.startsWith("/api/clientes")) {
        req.accesoLimitado = true; // Marcar acceso limitado
        return next();
    }

    if (req.usuario.rol !== rol) {
        return res.status(403).json({ mensaje: "No tienes permisos para esta acción" });
    }
    
    next();
};

