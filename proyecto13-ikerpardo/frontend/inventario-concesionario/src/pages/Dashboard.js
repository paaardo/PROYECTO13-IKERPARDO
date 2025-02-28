import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const Inicio = () => {
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(null);
  const [ingresosTotales, setIngresosTotales] = useState(null);
  const [vehiculosBaratos, setVehiculosBaratos] = useState([]);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuestas = await Promise.all([
          fetch("/api/vehiculos/disponibles"), // Número de vehículos disponibles
          fetch("/api/transacciones/ingresos"), // Ingresos totales
          fetch("/api/vehiculos/baratos"), // Vehículos más baratos
          fetch("/api/clientes/frecuentes"), // Clientes con más compras
        ]);

        const [vehiculosRes, ingresosRes, baratosRes, clientesRes] = await Promise.all(
          respuestas.map((res) => res.json())
        );

        setVehiculosDisponibles(vehiculosRes.cantidad);
        setIngresosTotales(ingresosRes.total);
        setVehiculosBaratos(baratosRes);
        setClientesFrecuentes(clientesRes);
      } catch (error) {
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  if (loading) return <p className="inicio__cargando">Cargando datos...</p>;
  if (error) return <p className="inicio__error">{error}</p>;

  return (
    <div className="inicio__contenedor">
      <h1 className="inicio__titulo">Resumen del Concesionario</h1>

      <section className="inicio__seccion">
        <h2 className="inicio__subtitulo">Estadísticas Generales</h2>
        <div className="inicio__estadisticas">
          <div className="inicio__estadistica">
            <p className="inicio__estadistica-label">Vehículos Disponibles</p>
            <p className="inicio__estadistica-valor">{vehiculosDisponibles}</p>
          </div>
          <div className="inicio__estadistica">
            <p className="inicio__estadistica-label">Ingresos Totales</p>
            <p className="inicio__estadistica-valor">
              ${ingresosTotales.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      <section className="inicio__seccion">
        <h2 className="inicio__subtitulo">Vehículos Más Baratos</h2>
        <ul className="inicio__lista-vehiculos">
          {vehiculosBaratos.map((vehiculo) => (
            <li key={vehiculo._id} className="inicio__vehiculo">
              <p>
                {vehiculo.marca} {vehiculo.modelo} - $
                {vehiculo.precio.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="inicio__seccion">
        <h2 className="inicio__subtitulo">Clientes con Más Compras</h2>
        <ul className="inicio__lista-clientes">
          {clientesFrecuentes.map((cliente) => (
            <li key={cliente._id} className="inicio__cliente">
              <p>
                {cliente.nombre} {cliente.apellido} - {cliente.compras} compras
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Inicio;
