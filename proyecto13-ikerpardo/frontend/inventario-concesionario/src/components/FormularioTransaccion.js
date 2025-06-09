import React, { useEffect, useState } from "react";
import axios from "axios";
import useVehiculos from "../hooks/useVehiculos";
import useTransacciones from "../hooks/useTransacciones";
import "../styles/FormularioTransaccion.css";

const FormularioTransaccion = ({
  onClose,
  onTransaccionAgregada,
  transaccion,
}) => {
  const {
    vehiculos,
    loading: loadingVehiculos,
    error: errorVehiculos,
  } = useVehiculos();
  const { agregarTransaccion } = useTransacciones();
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [errorClientes, setErrorClientes] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [total, setTotal] = useState("");
  const [mensajeError, setMensajeError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/clientes`, {
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

  useEffect(() => {
    if (transaccion) {
      setClienteSeleccionado(transaccion.cliente);
      setVehiculoSeleccionado(transaccion.vehiculo);
      setFecha(
        transaccion.fecha
          ? transaccion.fecha.split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setTotal(transaccion.total);
    } else {
      setClienteSeleccionado(null);
      setVehiculoSeleccionado(null);
      setFecha(new Date().toISOString().split("T")[0]);
      setTotal("");
    }
  }, [transaccion]);

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
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const fechaAdquisicion = vehiculoSeleccionado.fechaAdquisicion;

      if (!fechaAdquisicion) {
        onClose("No se encontró la fecha de adquisición del vehículo.");
        return;
      }

      const fechaTransaccionDate = new Date(fecha);
      const fechaAdquisicionDate = new Date(fechaAdquisicion);

      if (fechaTransaccionDate < fechaAdquisicionDate) {
        setMensajeError(
          `La fecha de transacción no puede ser anterior a la fecha de adquisición del vehículo (${
            fechaAdquisicion.split("T")[0]
          }).`
        );
        return;
      }

      if (transaccion) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/transacciones/${transaccion._id}`,
          {
            cliente: clienteSeleccionado._id,
            vehiculo: vehiculoSeleccionado._id,
            fecha,
            total,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onClose("Transacción editada exitosamente.");
      } else {
        await agregarTransaccion(
          {
            cliente: clienteSeleccionado._id,
            vehiculo: vehiculoSeleccionado._id,
            fecha,
            total,
          },
          token
        );
        onClose("Transacción agregada exitosamente.");
      }

      onTransaccionAgregada();
      setMensajeError(null);
      limpiarFormulario();
    } catch (err) {
      onClose("Error al guardar la transacción.");
    }
  };

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
  };

  return (
    <div className="contenedor-formulario-transaccion">
    <div className="formulario-transaccion">
      <h2>
        {transaccion ? "Editar Transacción" : "Agregar Nueva Transacción"}
      </h2>
      {mensajeError && (
        <p style={{ color: "red", marginTop: "10px" }}>{mensajeError}</p>
      )}
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
                    className={
                      clienteSeleccionado?._id === cliente._id
                        ? "seleccionado"
                        : ""
                    }
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
                  className={`vehiculo-card-transaccion ${
                    vehiculoSeleccionado?._id === vehiculo._id
                      ? "seleccionado"
                      : ""
                  }`}
                  onClick={() => seleccionarVehiculo(vehiculo)}
                  style={
                    vehiculo.estadoVehiculo === "Vendido"
                      ? { opacity: 0.5, pointerEvents: "none" }
                      : {}
                  }
                >
                  <img
                    src={vehiculo.imagen}
                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://d1cjrn2338s5db.cloudfront.net/gamas/images/25-467-2592-1685547326.png";
                    }}
                  />
                  <p>
                    {vehiculo.marca} {vehiculo.modelo} ({vehiculo.ano})
                  </p>
                  <p>
                    <strong>Estado:</strong> {vehiculo.estadoVehiculo}
                  </p>
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
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          min="0"
          step="0.01"
        />

        <div className="botones-transaccion">
          <button onClick={handleSubmit} className="btn-guardar-transaccion">
            {transaccion ? "Guardar Cambios" : "Agregar"}
          </button>
          <button
            onClick={limpiarFormulario}
            className="btn-limpiar-transaccion"
          >
            Limpiar
          </button>
          <button
            onClick={() => onClose(null)}
            className="btn-cancelar-transaccion"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FormularioTransaccion;
