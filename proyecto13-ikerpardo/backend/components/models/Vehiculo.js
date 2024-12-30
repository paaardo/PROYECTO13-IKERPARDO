// models/Vehiculo.js
const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
  vin: { type: String, required: true, unique: true },            // Número de identificación del vehículo
  marca: { type: String, required: true },                        // Marca
  modelo: { type: String, required: true },                       // Modelo
  tipo: { type: String, required: true },                         // Tipo de vehículo
  ano: { type: Number, required: true },                          // Año de fabricación
  kilometraje: { type: Number, required: true },                  // Kilometraje
  estado: { type: String, required: true },                       // Estado (Nuevo/Usado)
  precio: { type: Number, required: true },                       // Precio de venta
  fechaAdquisicion: { type: Date, required: true },               // Fecha de adquisición
  estadoVehiculo: { type: String, required: true },               // Estado del vehículo (Disponible/Vendido)
  imagen: { type: String },                                       // URL de la imagen del vehículo
  color: { type: String }                                         // Color en formato RGB
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema);
