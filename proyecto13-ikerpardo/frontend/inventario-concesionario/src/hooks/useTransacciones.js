import { useState, useEffect } from "react";
import axios from "axios";

const useTransacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransacciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/transacciones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransacciones(response.data);
    } catch (err) {
      setError("Error al cargar las transacciones");
    } finally {
      setLoading(false);
    }
  };

  const agregarTransaccion = async (nuevaTransaccion, token) => {
    try {
      const response = await axios.post("http://localhost:5000/api/transacciones", nuevaTransaccion, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Añadir la nueva transacción al estado sin necesidad de hacer otra petición
      setTransacciones([...transacciones, response.data]);
    } catch (err) {
      throw new Error("Error al agregar la transacción");
    }
  };

  useEffect(() => {
    fetchTransacciones();
  }, []);

  return {
    transacciones,
    loading,
    error,
    actualizarTransacciones: fetchTransacciones, // Permite recargar manualmente
    agregarTransaccion,
  };
};

export default useTransacciones;
