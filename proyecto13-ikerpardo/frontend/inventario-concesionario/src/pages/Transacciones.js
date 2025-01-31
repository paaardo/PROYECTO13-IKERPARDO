import React, { useState, useEffect } from "react";
import useTransacciones from "../hooks/useTransacciones";
import FormularioTransaccion from "../components/FormularioTransaccion";
import "../styles/Transacciones.css";

const Transacciones = () => {
  const { transacciones, loading, error, actualizarTransacciones } = useTransacciones(); // Importamos actualizarTransacciones
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [precioMinimo, setPrecioMinimo] = useState(0);
  const [precioMaximo, setPrecioMaximo] = useState(1000000);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState(null); // Estado para el mensaje de éxito

  useEffect(() => {
    actualizarTransacciones(); // Aseguramos que se carguen las transacciones al montar el componente
  });

  if (loading) return <p>Cargando transacciones...</p>;
  if (error) return <p>{error}</p>;

  const transaccionesFiltradas = transacciones.filter((transaccion) => {
    const nombreCompleto = `${transaccion.cliente?.nombre} ${transaccion.cliente?.apellido}`.toLowerCase();
    const cumpleNombre = nombreCompleto.includes(filtroNombre.toLowerCase());
    const cumpleFecha =
      (!filtroFechaInicio || new Date(transaccion.fecha) >= new Date(filtroFechaInicio)) &&
      (!filtroFechaFin || new Date(transaccion.fecha) <= new Date(filtroFechaFin));
    const cumpleEstado = !filtroEstado || transaccion.vehiculo?.estado === filtroEstado;
    const cumplePrecio = transaccion.total >= precioMinimo && transaccion.total <= precioMaximo;
    return cumpleNombre && cumpleFecha && cumpleEstado && cumplePrecio;
  });

  const handleAgregarTransaccion = () => {
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
  };

  const manejarNuevaTransaccion = () => {
    actualizarTransacciones(); // Refresca la lista de transacciones
    setMensaje("Transacción agregada correctamente."); // Muestra el mensaje en Transacciones.js
    setTimeout(() => setMensaje(null), 3000); // Oculta el mensaje después de 3 segundos
  };

  return (
    <div className="transacciones-container">
      <h1>Lista de Transacciones</h1>

      {mensaje && <div className="mensaje-exito">{mensaje}</div>} {/* Mensaje de éxito */}

      <button className="btn-agregar" onClick={handleAgregarTransaccion}>
        Agregar Transacción
      </button>

      {mostrarFormulario && <FormularioTransaccion onClose={handleCerrarFormulario} onTransaccionAgregada={manejarNuevaTransaccion} />} {/* Pasamos la función como prop */}

      <div className="filtros-container">
        <input
          type="text"
          placeholder="Filtrar por cliente"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <input type="date" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)} />
        <input type="date" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)} />
        <select className="filtro-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Usado">Usado</option>
        </select>
        <div className="filtro-precio">
          <label htmlFor="precioMinimo">Precio mínimo: ${precioMinimo.toLocaleString()}</label>
          <input
            type="range"
            id="precioMinimo"
            min="0"
            max="50000"
            step="500"
            value={precioMinimo}
            onChange={(e) => setPrecioMinimo(Number(e.target.value))}
          />
          <label htmlFor="precioMaximo">Precio máximo: ${precioMaximo.toLocaleString()}</label>
          <input
            type="range"
            id="precioMaximo"
            min="0"
            max="1000000"
            step="500"
            value={precioMaximo}
            onChange={(e) => setPrecioMaximo(Number(e.target.value))}
          />
        </div>
      </div>
      <table className="transacciones-tabla">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transaccionesFiltradas.map((transaccion) => (
            <tr key={transaccion._id}>
              <td>{transaccion.cliente?.nombre} {transaccion.cliente?.apellido}</td>
              <td>{transaccion.vehiculo?.marca} {transaccion.vehiculo?.modelo}</td>
              <td>{transaccion.vehiculo?.estado}</td>
              <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
              <td>${transaccion.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transacciones;
