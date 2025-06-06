import { useState, useEffect } from "react";
import axios from "axios";

const useTransacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransacciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/transacciones`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransacciones(response.data);
    } catch (err) {
      setError("Error al cargar las transacciones");
    } finally {
      setLoading(false);
    }
  };

  const agregarTransaccion = async (nuevaTransaccion, token) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/transacciones`,
        nuevaTransaccion,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransacciones([...transacciones, response.data]);
    } catch (err) {
      throw new Error("Error al agregar la transacción");
    }
  };

  const editarTransaccion = async (id, datosActualizados) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/transacciones/${id}`,
        datosActualizados,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTransacciones();
    } catch (err) {
      throw new Error("Error al editar la transacción");
    }
  };

  const eliminarTransaccion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/transacciones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransacciones();
    } catch (err) {
      throw new Error("Error al eliminar la transacción");
    }
  };

  useEffect(() => {
    fetchTransacciones();
  }, []);

  return {
    transacciones,
    loading,
    error,
    actualizarTransacciones: fetchTransacciones,
    agregarTransaccion,
    editarTransaccion,
    eliminarTransaccion,
  };
};

export default useTransacciones;
