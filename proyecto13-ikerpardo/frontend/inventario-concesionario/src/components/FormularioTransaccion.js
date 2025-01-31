import React, { useEffect, useState } from "react";
import axios from "axios";
import useVehiculos from "../hooks/useVehiculos";
import "../styles/FormularioTransaccion.css";

const FormularioTransaccion = ({ onClose }) => {
  const { vehiculos, loading: loadingVehiculos, error: errorVehiculos } = useVehiculos();
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [errorClientes, setErrorClientes] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Fecha actual por defecto
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
    setFecha(new Date().toISOString().split("T")[0]); // Reinicia la fecha al día actual
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
      await axios.post(
        "http://localhost:5000/api/transacciones",
        {
          cliente: clienteSeleccionado._id,
          vehiculo: vehiculoSeleccionado._id,
          fecha,
          total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje("Transacción agregada correctamente", "exito");
      limpiarFormulario();
    } catch (err) {
      mostrarMensaje("Error al agregar la transacción", "error");
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000); // Oculta el mensaje después de 3 segundos
  };

  const handleFechaChange = (e) => {
    const fechaIngresada = e.target.value;
    const fechaActual = new Date().toISOString().split("T")[0];

    // Si la fecha ingresada es anterior a hoy, la ajusta automáticamente
    if (fechaIngresada < fechaActual) {
      setFecha(fechaActual);
    } else {
      setFecha(fechaIngresada);
    }
  };

  return (
    <div className="formulario-transaccion">
      <h2>Agregar Nueva Transacción</h2>

      {/* Mensaje de éxito o error */}
      {mensaje && <div className={`mensaje-transaccion ${mensaje.tipo}`}>{mensaje.texto}</div>}

      <div className="formulario-contenido-transaccion">
        {/* Tabla de Clientes */}
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

        {/* Lista de Vehículos */}
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

      {/* Campos de Fecha y Total */}
      <div className="formulario-datos-transaccion">
        <label>Fecha de Transacción:</label>
        <input type="date" value={fecha} onChange={handleFechaChange} />

        <label>Monto Total:</label>
        <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} min="0" step="0.01" />

        {/* Botones */}
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
