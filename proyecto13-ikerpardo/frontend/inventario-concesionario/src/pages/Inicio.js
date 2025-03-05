import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Inicio.css";

const Inicio = () => {
  const [totalVehiculos, setTotalVehiculos] = useState(0);
  const [vehiculoMasBarato, setVehiculoMasBarato] = useState(null);
  const [clienteMasCompras, setClienteMasCompras] = useState(null);
  const [totalIngresos, setTotalIngresos] = useState(0);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      console.log("Obteniendo datos...");

      const token = localStorage.getItem("token");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Obtener vehículos
      const resVehiculos = await axios.get("http://localhost:5000/api/vehiculos", config);
      console.log("🔹 Vehículos obtenidos:", resVehiculos.data);

      // Filtrar vehículos por estadoVehiculo === "Disponible"
      const vehiculosDisponibles = resVehiculos.data.filter(
        (v) => v.estadoVehiculo?.toLowerCase() === "disponible"
      );
      console.log("✅ Vehículos disponibles:", vehiculosDisponibles);
      setTotalVehiculos(vehiculosDisponibles.length);

      // Obtener el vehículo más barato
      if (vehiculosDisponibles.length > 0) {
        const masBarato = vehiculosDisponibles.reduce((prev, curr) => 
          Number(curr.precio) < Number(prev.precio) ? curr : prev
        );
        console.log("🚗 Vehículo más barato:", masBarato);
        setVehiculoMasBarato(masBarato);
      } else {
        setVehiculoMasBarato(null);
      }

      // Obtener transacciones
      const resTransacciones = await axios.get("http://localhost:5000/api/transacciones", config);
      console.log("🔹 Transacciones obtenidas:", resTransacciones.data);

      // Calcular ingresos totales
      const ingresosTotales = resTransacciones.data.reduce((sum, t) => {
        const ingreso = Number(t.precio) || Number(t.total) || 0;
        console.log(`💰 Transacción ${t._id}: Precio = ${t.precio}, Total = ${t.total}, Usado = ${ingreso}`);
        return sum + ingreso;
      }, 0);
      console.log("✅ Total ingresos:", ingresosTotales);
      setTotalIngresos(ingresosTotales);

      // Obtener clientes
      const resClientes = await axios.get("http://localhost:5000/api/clientes", config);
      console.log("🔹 Clientes obtenidos:", resClientes.data);

      // Buscar cliente con más compras usando el campo 'compras'
      const masCompras = resClientes.data.reduce((prev, curr) => 
        (curr.compras.length > prev.compras.length ? curr : prev), resClientes.data[0]
      );

      console.log("🏆 Cliente con más compras:", masCompras);
      setClienteMasCompras(masCompras && masCompras.compras.length > 0 ? masCompras : null);

    } catch (error) {
      console.error("❌ Error al obtener datos:", error);
    }
  };

  return (
    <div className="inicio-container">
      <h1 className="inicio-titulo">Resumen del Concesionario</h1>

      <div className="inicio-resumen">
        <div className="inicio-card">
          <h3>Total de Vehículos Disponibles</h3>
          <p>{totalVehiculos}</p>
        </div>

        <div className="inicio-card">
          <h3>Vehículo Más Barato</h3>
          {vehiculoMasBarato ? (
            <p>{vehiculoMasBarato.marca} {vehiculoMasBarato.modelo} - {vehiculoMasBarato.precio}€</p>
          ) : (
            <p>No hay vehículos disponibles</p>
          )}
        </div>

        <div className="inicio-card">
          <h3>Cliente con Más Compras</h3>
          {clienteMasCompras ? (
            <p>{clienteMasCompras.nombre} {clienteMasCompras.apellido} ({clienteMasCompras.compras.length} compras)</p>
          ) : (
            <p>No hay clientes con compras</p>
          )}
        </div>

        <div className="inicio-card">
          <h3>Total de Ingresos por Ventas</h3>
          <p>{totalIngresos}€</p>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
