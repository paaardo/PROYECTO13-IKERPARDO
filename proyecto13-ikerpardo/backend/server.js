// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const vehiculoRoutes = require('./components/routes/vehiculoRoutes');
const clienteRoutes = require('./components/routes/clienteRoutes');
const transaccionRoutes = require('./components/routes/transaccionRoutes');
const authRoutes = require('./components/routes/authRoutes');
const { verificarToken, verificarRol } = require('./components/middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas protegidas con autenticación y roles
app.use('/api/vehiculos', verificarToken, vehiculoRoutes);
app.use('/api/clientes', verificarToken, verificarRol('admin'), clienteRoutes);
app.use('/api/transacciones', verificarToken, transaccionRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Conexión a MongoDB exitosa"))
.catch((error) => console.error("Error al conectar a MongoDB:", error));

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido al sistema de seguimiento de inventario');
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
