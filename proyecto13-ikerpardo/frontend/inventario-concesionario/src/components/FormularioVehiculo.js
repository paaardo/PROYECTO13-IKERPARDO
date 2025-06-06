import React, { useState, useEffect, useRef } from "react";
import "../styles/FormularioVehiculo.css";

const FormularioVehiculo = ({
  modoEdicion,
  vehiculoActual,
  onGuardar,
  onCancelar,
}) => {
  const formularioRef = useRef(null);
  const [formData, setFormData] = useState({
    vin: "",
    marca: "",
    modelo: "",
    tipo: "",
    ano: "",
    kilometraje: "",
    estado: "Usado",
    precio: "",
    fechaAdquisicion: "",
    estadoVehiculo: "Disponible",
    imagen: "",
    color: "#ffffff",
  });

  useEffect(() => {
    if (modoEdicion && vehiculoActual) {
      setFormData({
        vin: vehiculoActual.vin || "",
        marca: vehiculoActual.marca || "",
        modelo: vehiculoActual.modelo || "",
        tipo: vehiculoActual.tipo || "",
        ano: vehiculoActual.ano || "",
        kilometraje: vehiculoActual.kilometraje || "",
        estado: vehiculoActual.estado || "Usado",
        precio: vehiculoActual.precio || "",
        fechaAdquisicion: vehiculoActual.fechaAdquisicion
          ? vehiculoActual.fechaAdquisicion.split("T")[0]
          : "",
        estadoVehiculo: vehiculoActual.estadoVehiculo || "Disponible",
        imagen: vehiculoActual.imagen || "",
        color: vehiculoActual.color || "#ffffff",
      });
    } else {
      limpiarFormulario();
    }
    formularioRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [modoEdicion, vehiculoActual]);

  const limpiarFormulario = () => {
    setFormData({
      vin: "",
      marca: "",
      modelo: "",
      tipo: "",
      ano: "",
      kilometraje: "",
      estado: "Usado",
      precio: "",
      fechaAdquisicion: "",
      estadoVehiculo: "Disponible",
      imagen: "",
      color: "#ffffff",
    });
  };

  const handleKeyDown = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const currentYear = new Date().getFullYear();

    if (name === "vin") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else if (name === "ano") {
      let nuevoAno = Math.max(1950, Math.min(value, currentYear));
      let nuevaFechaAdquisicion = formData.fechaAdquisicion;

      if (nuevaFechaAdquisicion) {
        const anoAdquisicion = new Date(nuevaFechaAdquisicion).getFullYear();
        if (anoAdquisicion < nuevoAno) {
          nuevaFechaAdquisicion = `${nuevoAno}-01-01`;
        }
      }

      setFormData({
        ...formData,
        ano: nuevoAno,
        fechaAdquisicion: nuevaFechaAdquisicion,
      });
    } else if (name === "tipo") {
      if (/^[a-zA-Z\s]*$/.test(value))
        setFormData({ ...formData, [name]: value });
    } else if (name === "estado" && value === "Nuevo") {
      setFormData({ ...formData, [name]: value, kilometraje: "0" });
    } else if (name === "fechaAdquisicion") {
      const selectedYear = new Date(value).getFullYear();
      if (
        selectedYear >= formData.ano &&
        value <= new Date().toISOString().split("T")[0]
      ) {
        setFormData({ ...formData, [name]: value });
      } else if (selectedYear < formData.ano) {
        const fechaMinima = `${formData.ano}-01-01`;
        setFormData({ ...formData, [name]: fechaMinima });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.vin ||
      !formData.marca ||
      !formData.modelo ||
      !formData.ano ||
      !formData.tipo ||
      !formData.kilometraje ||
      !formData.precio ||
      !formData.fechaAdquisicion
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!formData.imagen) {
      formData.imagen =
        "https://d1cjrn2338s5db.cloudfront.net/gamas/images/25-467-2592-1685547326.png";
    }

    // Esta const hace que cuando recogemos el campo color de la BBDD al estar con puntos,
    // recoja unicamente los 3 valores y los pase a sistema RGB ya que estos van unicamente con comas
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `(${r}, ${g}, ${b})`;
    };

    formData.color = hexToRgb(formData.color);
    const anoAdquisicion = new Date(formData.fechaAdquisicion).getFullYear();
    if (anoAdquisicion < formData.ano) {
      alert(
        "El año de adquisicion no puede ser anterior al año de fabricacion"
      );
      return;
    }

    onGuardar(formData);
  };

  return (
    <div className="contenedor-formulario-vehiculo" ref={formularioRef}>
      <div className="formulario-vehiculo">
        <h2>{modoEdicion ? "Editar Vehículo" : "Agregar Vehículo"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            VIN (Número de Identificación del Vehículo)
            <input
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              placeholder="Ej: 1HGCM82633A123456"
              required
            />
          </label>
          <label>
            Marca
            <input
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              placeholder="Ej: Toyota"
              required
            />
          </label>
          <label>
            Modelo
            <input
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Ej: Corolla"
              required
            />
          </label>
          <label>
            Tipo de Vehículo
            <input
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              placeholder="Ej: Sedán, SUV"
              required
            />
          </label>
          <label>
            Año de Fabricación
            <input
              name="ano"
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              value={formData.ano}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              placeholder="Ej: 2023"
              required
            />
          </label>
          <label>
            Kilometraje
            <input
              name="kilometraje"
              type="number"
              value={formData.kilometraje}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ej: 15000"
              disabled={formData.estado === "Nuevo"}
              required
            />
          </label>
          <label>
            Estado
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
            </select>
          </label>
          <label>
            Precio de Venta
            <input
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ej: 20000"
              required
            />
          </label>
          <label>
            Fecha de Adquisición
            <input
              name="fechaAdquisicion"
              type="date"
              value={formData.fechaAdquisicion}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Estado del Vehículo
            <select
              name="estadoVehiculo"
              value={formData.estadoVehiculo}
              onChange={handleChange}
              required
            >
              <option value="Disponible">Disponible</option>
              <option value="Vendido">Vendido</option>
              <option value="Reservado">Reservado</option>
            </select>
          </label>
          <label>
            URL de la Imagen
            <input
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="Ej: https://imagen.com/coche.jpg"
            />
          </label>
          <label>
            Color
            <input
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
            <div
              style={{
                width: "50px",
                height: "20px",
                backgroundColor: formData.color,
              }}
            />
          </label>
          <div className="botones">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioVehiculo;
