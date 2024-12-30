// importarVehiculos.js
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Vehiculo = require('../components/models/Vehiculo');
require('dotenv').config();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Conexión a MongoDB para importar datos exitosa"))
.catch((error) => console.error("Error al conectar a MongoDB:", error));

// Función para transformar datos y hacer la importación
const transformarDatosVehiculo = (row) => ({
    vin: row['Número de identificación del vehículo (VIN)'],
    marca: row['Marca'],
    modelo: row['Modelo'],
    tipo: row['Tipo de vehículo'],
    ano: parseInt(row['Año de fabricación'], 10),
    kilometraje: parseInt(row['Kilometraje'].replace(" km", ""), 10) * 1000,
    estado: row['Estado'],
    precio: parseFloat(row['Precio de venta'].replace("$", "").replace(",", "")) * 1000, // Multiplicamos por 100 para obtener el valor exacto en centavos
    fechaAdquisicion: new Date(row['Fecha de adquisición']).toISOString().split("T")[0], // Solo año, mes, día
    estadoVehiculo: row['Estado del vehículo'],
    imagen: row['Imagen'],
    color: row['Color']
});

// Función para importar datos de vehículos
const importarVehiculos = () => {
    return new Promise((resolve, reject) => {
        const vehiculos = [];
        fs.createReadStream('./data/Base de datos de concesionario - Vehiculos.csv') // Ajusta la ruta si es necesario
            .pipe(csv())
            .on('data', (row) => {
                const vehiculo = transformarDatosVehiculo(row);
                vehiculos.push(vehiculo);
            })
            .on('end', async () => {
                try {
                    await Vehiculo.insertMany(vehiculos);
                    console.log("Datos de vehículos importados exitosamente");
                    resolve();
                } catch (error) {
                    console.error("Error al importar vehículos:", error);
                    reject(error);
                } finally {
                    mongoose.connection.close();
                }
            })
            .on('error', (error) => reject(error));
    });
};

// Ejecutar la importación de datos
importarVehiculos().catch((error) => console.error("Error en la importación:", error));
