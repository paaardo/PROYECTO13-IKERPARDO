import React, { useState } from "react";
import { useEffect } from "react";
import useVehiculos from "../hooks/useVehiculos";
import FormularioVehiculo from "../components/FormularioVehiculo";
import "../styles/Vehiculos.css";

const Vehiculos = () => {
  const {
    vehiculos,
    loading,
    error,
    agregarVehiculo,
    editarVehiculo,
    eliminarVehiculo,
    reservarVehiculo,
    cancelarReserva,
  } = useVehiculos();

  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [precioMinimo, setPrecioMinimo] = useState(0);
  const [precioMaximo, setPrecioMaximo] = useState(100000);
  const [botonConfirmacion, setBotonConfirmacion] = useState(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoActual, setVehiculoActual] = useState(null);
  const [vehiculoReservadoId, setVehiculoReservadoId] = useState(null);

  useEffect(() => {
    const reservaGuardada = localStorage.getItem("vehiculoReservadoId");
    if (reservaGuardada) {
      setVehiculoReservadoId(reservaGuardada);
    }
  }, []);

  const handleAgregar = () => {
    setFormularioVisible(true);
    setModoEdicion(false);
  };

  const handleEditar = (vehiculo) => {
    setFormularioVisible(true);
    setModoEdicion(true);
    setVehiculoActual(vehiculo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = (id) => {
    if (botonConfirmacion === id) {
      eliminarVehiculo(id);
      setBotonConfirmacion(null);
      setMensajeConfirmacion("Vehículo eliminado exitosamente.");
      setTimeout(() => setMensajeConfirmacion(""), 5000);
    } else {
      setBotonConfirmacion(id);
      setTimeout(() => setBotonConfirmacion(null), 5000);
    }
  };

  const handleReservar = async (vehiculoId) => {
    try {
      await reservarVehiculo(vehiculoId);
      setVehiculoReservadoId(vehiculoId);
      localStorage.setItem("vehiculoReservadoId", vehiculoId);
      setMensajeConfirmacion("¡Coche reservado correctamente!");
      setTimeout(() => setMensajeConfirmacion(""), 5000);
    } catch (error) {
      setMensajeConfirmacion("Error al reservar el vehículo.");
      setTimeout(() => setMensajeConfirmacion(""), 5000);
    }
  };

  const handleCancelarReserva = async () => {
    try {
      await cancelarReserva();
      setVehiculoReservadoId(null);
      localStorage.removeItem("vehiculoReservadoId");
      setMensajeConfirmacion("Reserva cancelada.");
      setTimeout(() => setMensajeConfirmacion(""), 5000);
    } catch (error) {
      setMensajeConfirmacion("Error al cancelar la reserva.");
      setTimeout(() => setMensajeConfirmacion(""), 5000);
    }
  };

  const handleFormularioCerrar = () => {
    setFormularioVisible(false);
    setModoEdicion(false);
    setVehiculoActual(null);
  };

  const handleFormularioGuardar = (datosVehiculo) => {
    if (modoEdicion) {
      editarVehiculo(vehiculoActual._id, datosVehiculo);
      setMensajeConfirmacion("Vehículo modificado exitosamente.");
    } else {
      agregarVehiculo(datosVehiculo);
      setMensajeConfirmacion("Vehículo agregado exitosamente.");
    }
    handleFormularioCerrar();

    setTimeout(() => setMensajeConfirmacion(""), 5000);
  };

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const coincideEstado = estadoFiltro
      ? vehiculo.estadoVehiculo === estadoFiltro
      : true;
    const coincideMarca = marcaFiltro ? vehiculo.marca === marcaFiltro : true;
    const coincidePrecio =
      vehiculo.precio >= precioMinimo && vehiculo.precio <= precioMaximo;

    return coincideEstado && coincideMarca && coincidePrecio;
  });

  const parseToRGB = (color) => {
    const match = color.match(/\d+/g);
    if (match && match.length === 3) {
      return `rgb(${match.join(", ")})`;
    }
    return "#ccc";
  };

  if (loading) return <p>Cargando vehículos...</p>;
  if (error) return <p>{error}</p>;
  const rol = localStorage.getItem("rol") || "";
  return (
    <div className="vehiculos-container">
      <div className="vehiculos-header">
        <h1>Lista de Vehículos</h1>
        {rol === "admin" && (
          <button className="btn-agregar" onClick={handleAgregar}>
            Agregar Vehículo
          </button>
        )}
        <br></br>
        {mensajeConfirmacion && (
          <div className="mensaje-confirmacion">{mensajeConfirmacion}</div>
        )}
      </div>
      {formularioVisible && (
        <FormularioVehiculo
          modoEdicion={modoEdicion}
          vehiculoActual={vehiculoActual}
          onGuardar={handleFormularioGuardar}
          onCancelar={handleFormularioCerrar}
        />
      )}
      <div className="filtros-container">
        <select
          className="filtro-select"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Reservado">Reservado</option>
          <option value="Vendido">Vendido</option>
        </select>

        <select
          className="filtro-select"
          value={marcaFiltro}
          onChange={(e) => setMarcaFiltro(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {[...new Set(vehiculos.map((v) => v.marca))].map((marca) => (
            <option key={marca} value={marca}>
              {marca}
            </option>
          ))}
        </select>

        <div className="filtro-precio">
          <label htmlFor="precioMinimo">
            Precio mínimo: ${precioMinimo.toLocaleString()}
          </label>
          <input
            type="range"
            id="precioMinimo"
            min="0"
            max={precioMaximo}
            step="500"
            value={precioMinimo}
            onChange={(e) => {
              const nuevoMin = Number(e.target.value);
              setPrecioMinimo(nuevoMin);
              if (nuevoMin > precioMaximo) {
                setPrecioMaximo(nuevoMin);
              }
            }}
          />

          <label htmlFor="precioMaximo">
            Precio máximo: ${precioMaximo.toLocaleString()}
          </label>
          <input
            type="range"
            id="precioMaximo"
            min={precioMinimo}
            max="100000"
            step="500"
            value={precioMaximo}
            onChange={(e) => {
              const nuevoMax = Number(e.target.value);
              setPrecioMaximo(nuevoMax);
              if (nuevoMax < precioMinimo) {
                setPrecioMinimo(nuevoMax);
              }
            }}
          />
        </div>
      </div>
      <div className="lista-vehiculos">
        {vehiculosFiltrados.length === 0 ? (
          <p className="mensaje-sin-resultados">
            No se han encontrado vehículos con los filtros seleccionados.
          </p>
        ) : (
          vehiculosFiltrados.map((vehiculo) => (
            <div key={vehiculo._id} className="vehiculo-card">
              <img
                src={vehiculo.imagen}
                alt={`Imagen de ${vehiculo.marca} ${vehiculo.modelo}`}
                className="vehiculo-imagen"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://d1cjrn2338s5db.cloudfront.net/gamas/images/25-467-2592-1685547326.png";
                }}
              />
              <div className="vehiculo-detalles">
                <h3>
                  {vehiculo.marca} {vehiculo.modelo} ({vehiculo.ano})
                </h3>
                <p>
                  <strong>VIN:</strong> {vehiculo.vin}
                </p>
                <p>
                  <strong>Tipo:</strong> {vehiculo.tipo}
                </p>
                <p>
                  <strong>Kilometraje:</strong>{" "}
                  {vehiculo.kilometraje.toLocaleString()} km
                </p>
                <p>
                  <strong>Estado:</strong> {vehiculo.estado}
                </p>
                <p>
                  <strong>Precio:</strong> ${vehiculo.precio.toLocaleString()}
                </p>
                <p>
                  <strong>Color:</strong>
                  {vehiculo.color ? (
                    <span
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        backgroundColor: parseToRGB(vehiculo.color),
                        border: "1px solid #ccc",
                        borderRadius: "50%",
                        marginLeft: "8px",
                      }}
                      title={vehiculo.color}
                    ></span>
                  ) : (
                    "No especificado"
                  )}
                </p>
                <p>
                  <strong>Estado Vehículo:</strong> {vehiculo.estadoVehiculo}
                </p>
                <p>
                  <strong>Fecha Adquisición:</strong>{" "}
                  {new Date(vehiculo.fechaAdquisicion).toLocaleDateString()}
                </p>
                <div className="acciones-vehiculos">
                  {rol === "admin" ? (
                    <>
                      <button
                        className="btn-editar"
                        onClick={() => handleEditar(vehiculo)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleEliminar(vehiculo._id)}
                      >
                        {botonConfirmacion === vehiculo._id
                          ? "¿Seguro?"
                          : "Eliminar"}
                      </button>
                    </>
                  ) : vehiculoReservadoId === vehiculo._id ? (
                    <>
                      <button
                        className="btn-eliminar"
                        onClick={() => {
                          if (botonConfirmacion === vehiculo._id) {
                            handleCancelarReserva();
                            setBotonConfirmacion(null);
                          } else {
                            setBotonConfirmacion(vehiculo._id);
                            setTimeout(() => {
                              setBotonConfirmacion(null);
                            }, 5000);
                          }
                        }}
                      >
                        {botonConfirmacion === vehiculo._id
                          ? "¿Seguro?"
                          : "Cancelar Reserva"}
                      </button>
                      <button className="btn-reservado">
                        ¡Coche Reservado!
                      </button>
                    </>
                  ) : vehiculo.estadoVehiculo === "Disponible" &&
                    !vehiculoReservadoId ? (
                    <>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleReservar(vehiculo._id)}
                      >
                        Reservar
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vehiculos;
