import { useState, useEffect } from "react";
import axios from "axios";

const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/vehiculos`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVehiculos(response.data);
      } catch (err) {
        setError("Error al cargar los vehículos");
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  const agregarVehiculo = async (nuevoVehiculo) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/vehiculos`,
        nuevoVehiculo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVehiculos((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Error al agregar el vehículo", err);
    }
  };

  const editarVehiculo = async (id, vehiculoActualizado) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/vehiculos/${id}`,
        vehiculoActualizado,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVehiculos((prev) =>
        prev.map((vehiculo) =>
          vehiculo._id === id ? vehiculoActualizado : vehiculo
        )
      );
    } catch (err) {
      console.error("Error al editar el vehículo", err);
    }
  };

  const eliminarVehiculo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/vehiculos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehiculos((prev) => prev.filter((vehiculo) => vehiculo._id !== id));
    } catch (err) {
      console.error("Error al eliminar el vehículo", err);
    }
  };

  const reservarVehiculo = async (vehiculoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/clientes/reservar/${vehiculoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehiculos((prev) =>
        prev.map((vehiculo) =>
          vehiculo._id === vehiculoId
            ? { ...vehiculo, estadoVehiculo: "Reservado" }
            : vehiculo
        )
      );
      return response.data;
    } catch (err) {
      console.error("Error al reservar el vehículo", err);
      throw err;
    }
  };

  const cancelarReserva = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:5000/api/clientes/cancelar-reserva`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const vehiculoCancelado = response.data.vehiculoCancelado;

    if (vehiculoCancelado && vehiculoCancelado._id) {
      setVehiculos((prev) =>
        prev.map((vehiculo) =>
          vehiculo._id === vehiculoCancelado._id
            ? { ...vehiculo, estadoVehiculo: "Disponible" }
            : vehiculo
        )
      );
    }

    return response.data;
  } catch (err) {
    console.error("Error al cancelar la reserva", err);
    throw err;
  }
};

  return {
    vehiculos,
    loading,
    error,
    agregarVehiculo,
    editarVehiculo,
    eliminarVehiculo,
    reservarVehiculo,
    cancelarReserva,
  };
};

export default useVehiculos;
