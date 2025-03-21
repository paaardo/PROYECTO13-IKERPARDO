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

app.use(cors());
app.use(express.json());

// Rutas de autenticacion
app.use('/api/auth', authRoutes);

// Rutas protegidas con autenticacion y roles
app.use('/api/vehiculos', verificarToken, vehiculoRoutes);
app.use('/api/clientes', verificarToken, clienteRoutes);
app.use('/api/transacciones', verificarToken, transaccionRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Conexión a MongoDB exitosa"))
.catch((error) => console.error("Error al conectar a MongoDB:", error));

app.get('/', (req, res) => {
    res.send('Bienvenido al sistema de seguimiento de inventario');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en el puerto ${PORT}`);
});
