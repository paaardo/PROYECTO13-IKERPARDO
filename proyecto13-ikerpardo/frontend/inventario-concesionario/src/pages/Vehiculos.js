import React, { useState } from "react";
import useVehiculos from "../hooks/useVehiculos"; // Importamos el custom hook
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
  } = useVehiculos();

  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [precioMinimo, setPrecioMinimo] = useState(0);
  const [precioMaximo, setPrecioMaximo] = useState(50000);
  const [botonConfirmacion, setBotonConfirmacion] = useState(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(""); // Estado para el mensaje
  const [formularioVisible, setFormularioVisible] = useState(false); // Mostrar/ocultar formulario
  const [modoEdicion, setModoEdicion] = useState(false); // Indicar si es agregar o editar
  const [vehiculoActual, setVehiculoActual] = useState(null); // Datos del vehículo para edición

  // Manejo de CRUD
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
      setMensajeConfirmacion("Vehículo eliminado exitosamente."); // Establece el mensaje
      setTimeout(() => setMensajeConfirmacion(""), 5000); // Limpia el mensaje después de 5 segundos
    } else {
      setBotonConfirmacion(id);
      setTimeout(() => setBotonConfirmacion(null), 5000);
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

    // Limpiar mensaje después de unos segundos
    setTimeout(() => setMensajeConfirmacion(""), 5000);
  };

  // Filtros aplicados
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
    // Elimina paréntesis y divide por comas
    const match = color.match(/\d+/g);
    if (match && match.length === 3) {
      return `rgb(${match.join(", ")})`;
    }
    return "#ccc";
  };

  if (loading) return <p>Cargando vehículos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vehiculos-container">
      <div className="vehiculos-header">
        <h1>Lista de Vehículos</h1>
        <button className="btn-agregar" onClick={handleAgregar}>
          Agregar Vehículo
        </button>
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
            max="50000"
            step="500"
            value={precioMaximo}
            onChange={(e) => setPrecioMaximo(Number(e.target.value))}
          />
        </div>
      </div>
      {/* Lista de Vehículos */}
      <div className="lista-vehiculos">
        {vehiculosFiltrados.map((vehiculo) => (
          <div key={vehiculo._id} className="vehiculo-card">
            <img
              src={vehiculo.imagen}
              alt={`Imagen de ${vehiculo.marca} ${vehiculo.modelo}`}
              className="vehiculo-imagen"
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
              <div className="acciones">
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
                  {botonConfirmacion === vehiculo._id ? "¿Seguro?" : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehiculos;
