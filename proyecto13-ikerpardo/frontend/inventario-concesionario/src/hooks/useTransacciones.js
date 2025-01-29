import { useState, useEffect } from "react";
import axios from "axios";

const useTransacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransacciones = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/transacciones",
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

    fetchTransacciones();
  }, []);

  return {
    transacciones,
    loading,
    error,
  };
};

export default useTransacciones;
