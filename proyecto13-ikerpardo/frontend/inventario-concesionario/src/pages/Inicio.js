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

      // Filtrar vehículos por estadoVehiculo === "Disponible"
      const vehiculosDisponibles = resVehiculos.data.filter(
        (v) => v.estadoVehiculo?.toLowerCase() === "disponible"
      );
      setTotalVehiculos(vehiculosDisponibles.length);

      // Obtener el vehículo más barato
      if (vehiculosDisponibles.length > 0) {
        const masBarato = vehiculosDisponibles.reduce((prev, curr) => 
          Number(curr.precio) < Number(prev.precio) ? curr : prev
        );
        setVehiculoMasBarato(masBarato);
      } else {
        setVehiculoMasBarato(null);
      }

      // Obtener transacciones
      const resTransacciones = await axios.get("http://localhost:5000/api/transacciones", config);

      // Calcular ingresos totales
      const ingresosTotales = resTransacciones.data.reduce((sum, t) => {
        const ingreso = Number(t.precio) || Number(t.total) || 0;
        return sum + ingreso;
      }, 0);
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

      {/* Sección de la imagen del concesionario */}
      <div className="inicio-imagen">
        <img src="/images/concesionario.jpg" alt="Concesionario" />
      </div>
    </div>
  );
};

export default Inicio;
