import React, { useEffect, useState } from "react";
import axios from "axios";
import useVehiculos from "../hooks/useVehiculos";
import useTransacciones from "../hooks/useTransacciones"; // Importamos el hook
import "../styles/FormularioTransaccion.css";

const FormularioTransaccion = ({ onClose, onTransaccionAgregada }) => {
  const { vehiculos, loading: loadingVehiculos, error: errorVehiculos } = useVehiculos();
  const {agregarTransaccion } = useTransacciones(); // Importamos las funciones necesarias
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [errorClientes, setErrorClientes] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [total, setTotal] = useState("");
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data);
      } catch (err) {
        setErrorClientes("Error al cargar los clientes");
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const seleccionarVehiculo = (vehiculo) => {
    if (vehiculo.estadoVehiculo !== "Vendido") {
      setVehiculoSeleccionado(vehiculo);
    }
  };

  const limpiarFormulario = () => {
    setClienteSeleccionado(null);
    setVehiculoSeleccionado(null);
    setFecha(new Date().toISOString().split("T")[0]);
    setTotal("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteSeleccionado || !vehiculoSeleccionado || !fecha || !total) {
      mostrarMensaje("Todos los campos son obligatorios.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await agregarTransaccion(
        {
          cliente: clienteSeleccionado._id,
          vehiculo: vehiculoSeleccionado._id,
          fecha,
          total,
        },
        token
      );

      onTransaccionAgregada(); // Llamamos la función para actualizar la lista y mostrar el mensaje
      limpiarFormulario();
      onClose(); // Cerrar el formulario automáticamente
    } catch (err) {
      mostrarMensaje("Error al agregar la transacción", "error");
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleFechaChange = (e) => {
    const fechaIngresada = e.target.value;
    const fechaActual = new Date().toISOString().split("T")[0];

    if (fechaIngresada < fechaActual) {
      setFecha(fechaActual);
    } else {
      setFecha(fechaIngresada);
    }
  };

  return (
    <div className="formulario-transaccion">
      <h2>Agregar Nueva Transacción</h2>
      {mensaje && <div className={`mensaje-transaccion ${mensaje.tipo}`}>{mensaje.texto}</div>}

      <div className="formulario-contenido-transaccion">
        <div className="clientes-lista-transaccion">
          <h3>Seleccionar Cliente</h3>
          {loadingClientes ? (
            <p>Cargando clientes...</p>
          ) : errorClientes ? (
            <p>{errorClientes}</p>
          ) : (
            <table className="clientes-tabla-transaccion">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente._id}
                    onClick={() => seleccionarCliente(cliente)}
                    className={clienteSeleccionado?._id === cliente._id ? "seleccionado" : ""}
                  >
                    <td>{cliente.nombre}</td>
                    <td>{cliente.apellido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="vehiculos-lista-transaccion">
          <h3>Seleccionar Vehículo</h3>
          {loadingVehiculos ? (
            <p>Cargando vehículos...</p>
          ) : errorVehiculos ? (
            <p>{errorVehiculos}</p>
          ) : (
            <div className="lista-vehiculos-transaccion">
              {vehiculos.map((vehiculo) => (
                <div
                  key={vehiculo._id}
                  className={`vehiculo-card-transaccion ${vehiculoSeleccionado?._id === vehiculo._id ? "seleccionado" : ""}`}
                  onClick={() => seleccionarVehiculo(vehiculo)}
                  style={vehiculo.estadoVehiculo === "Vendido" ? { opacity: 0.5, pointerEvents: "none" } : {}}
                >
                  <img src={vehiculo.imagen} alt={`${vehiculo.marca} ${vehiculo.modelo}`} />
                  <p>{vehiculo.marca} {vehiculo.modelo} ({vehiculo.ano})</p>
                  <p><strong>Estado:</strong> {vehiculo.estadoVehiculo}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <br />

      <div className="formulario-datos-transaccion">
        <label>Fecha de Transacción:</label>
        <input type="date" value={fecha} onChange={handleFechaChange} />

        <label>Monto Total:</label>
        <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} min="0" step="0.01" />

        <div className="botones-transaccion">
          <button onClick={handleSubmit} className="btn-guardar-transaccion">Agregar</button>
          <button onClick={limpiarFormulario} className="btn-limpiar-transaccion">Limpiar</button>
          <button onClick={onClose} className="btn-cancelar-transaccion">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default FormularioTransaccion;
