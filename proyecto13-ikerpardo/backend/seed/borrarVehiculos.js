const mongoose = require('mongoose');
const Vehiculo = require('../components/models/Vehiculo');
require('dotenv').config();
console.log(process.env.MONGO_URI); 
// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Conexión a MongoDB para eliminar vehículos exitosa"))
.catch((error) => console.error("Error al conectar a MongoDB:", error));

// Borrar todos los documentos de la colección de vehículos
Vehiculo.deleteMany({})
    .then(() => {
        console.log("Todos los vehículos han sido eliminados de la base de datos");
        mongoose.connection.close();
    })
    .catch((error) => console.error("Error al eliminar vehículos:", error));
