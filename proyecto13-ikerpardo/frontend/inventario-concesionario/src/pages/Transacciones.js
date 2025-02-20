import React, { useState, useEffect } from "react";
import useTransacciones from "../hooks/useTransacciones";
import FormularioTransaccion from "../components/FormularioTransaccion";
import "../styles/Transacciones.css";

const Transacciones = () => {
  const {
    transacciones,
    loading,
    error,
    actualizarTransacciones,
    eliminarTransaccion,
  } = useTransacciones();

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [precioMinimo, setPrecioMinimo] = useState(0);
  const [precioMaximo, setPrecioMaximo] = useState(1000000);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [transaccionEditando, setTransaccionEditando] = useState(null);
  const [botonConfirmacion, setBotonConfirmacion] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    actualizarTransacciones();
  });

  if (loading) return <p>Cargando transacciones...</p>;
  if (error) return <p>{error}</p>;

  const transaccionesFiltradas = transacciones.filter((transaccion) => {
    const nombreCompleto =
      `${transaccion.cliente?.nombre} ${transaccion.cliente?.apellido}`.toLowerCase();
    const cumpleNombre = nombreCompleto.includes(filtroNombre.toLowerCase());
    const cumpleFecha =
      (!filtroFechaInicio ||
        new Date(transaccion.fecha) >= new Date(filtroFechaInicio)) &&
      (!filtroFechaFin ||
        new Date(transaccion.fecha) <= new Date(filtroFechaFin));
    const cumpleEstado =
      !filtroEstado || transaccion.vehiculo?.estado === filtroEstado;
    const cumplePrecio =
      transaccion.total >= precioMinimo && transaccion.total <= precioMaximo;
    return cumpleNombre && cumpleFecha && cumpleEstado && cumplePrecio;
  });

  const handleEditar = async (transaccion) => {
    setTransaccionEditando(transaccion);
    setMostrarFormulario(true);
  };

  const handleAgregar = async () => {
    setTransaccionEditando(null);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = async (mensajeExito = null) => {
    setTransaccionEditando(null);
    setMostrarFormulario(false);
    if (mensajeExito) {
      setMensaje(mensajeExito);
      setTimeout(() => setMensaje(null), 5000);
    }
  };

  const handleEliminar = async (id, vehiculoId) => {
    if (botonConfirmacion === id) {
      try {
        await eliminarTransaccion(id);
        setBotonConfirmacion(null);
        setMensaje("Transacción eliminada exitosamente.");
        setTimeout(() => setMensaje(null), 5000);
      } catch (error) {
        setMensaje("Error al eliminar la transacción.");
        setTimeout(() => setMensaje(null), 5000);
      }
    } else {
      setBotonConfirmacion(id);
      setTimeout(() => setBotonConfirmacion(null), 5000);
    }
  };

  return (
    <div className="transacciones-container">
      <h1>Lista de Transacciones</h1>

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <button className="btn-agregar" onClick={handleAgregar}>
        Agregar Transacción
      </button>

      {mostrarFormulario && (
        <FormularioTransaccion
          onClose={handleCerrarFormulario}
          transaccion={transaccionEditando}
          onTransaccionAgregada={actualizarTransacciones}
        />
      )}

      <div className="filtros-container-transacciones">
        <input
          type="text"
          placeholder="Filtrar por cliente"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <div className="filtro-fecha">
          <label htmlFor="fechaInicio">Fecha Mínima:</label>
          <input
            type="date"
            id="fechaInicio"
            value={filtroFechaInicio}
            onChange={(e) => setFiltroFechaInicio(e.target.value)}
          />
        </div>

        <div className="filtro-fecha">
          <label htmlFor="fechaFin">Fecha Máxima:</label>
          <input
            type="date"
            id="fechaFin"
            value={filtroFechaFin}
            onChange={(e) => setFiltroFechaFin(e.target.value)}
          />
        </div>
        <select
          className="filtro-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Usado">Usado</option>
        </select>
        <div className="filtro-precio">
          <label htmlFor="precioMinimo">
            Precio mínimo: ${precioMinimo.toLocaleString()}
          </label>
          <input
            type="range"
            id="precioMinimo"
            min="0"
            max="50000"
            step="500"
            value={precioMinimo}
            onChange={(e) => setPrecioMinimo(Number(e.target.value))}
          />
          <label htmlFor="precioMaximo">
            Precio máximo: ${precioMaximo.toLocaleString()}
          </label>
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
            <th>Modificar</th>
          </tr>
        </thead>
        <tbody>
          {transaccionesFiltradas.map((transaccion) => (
            <tr key={transaccion._id}>
              <td>{`${transaccion.cliente?.nombre} ${transaccion.cliente?.apellido}`}</td>
              <td>{`${transaccion.vehiculo?.marca} ${transaccion.vehiculo?.modelo}`}</td>
              <td>{transaccion.vehiculo?.estado}</td>
              <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
              <td>${transaccion.total.toLocaleString()}</td>
              <td className="acciones">
                <button
                  className="btn-editar"
                  onClick={() => handleEditar(transaccion)}
                >
                  Editar
                </button>
                {!transaccionEditando ||
                transaccionEditando._id !== transaccion._id ? (
                  <button
                    className="btn-eliminar"
                    onClick={() =>
                      handleEliminar(transaccion._id, transaccion.vehiculo._id)
                    }
                  >
                    {botonConfirmacion === transaccion._id
                      ? "¿Seguro?"
                      : "Eliminar"}
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transacciones;
