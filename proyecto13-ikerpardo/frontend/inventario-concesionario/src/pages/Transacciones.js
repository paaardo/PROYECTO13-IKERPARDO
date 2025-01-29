// pages/Transacciones.js
import React from "react";
import useTransacciones from "../hooks/useTransacciones";
import "../styles/Transacciones.css";

const Transacciones = () => {
  const { transacciones, loading, error } = useTransacciones();

  if (loading) return <p>Cargando transacciones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="transacciones-container">
      <h1>Lista de Transacciones</h1>
      <table className="transacciones-tabla">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
  {transacciones.map((transaccion) => (
    <tr key={transaccion._id}>
      <td>{transaccion.cliente?.nombre} {transaccion.cliente?.apellido}</td>
      <td>{transaccion.vehiculo?.marca} {transaccion.vehiculo?.modelo} ({transaccion.vehiculo?.estado})</td>
      <td>{new Date(transaccion.fecha).toLocaleDateString()}</td>
      <td>${transaccion.total.toLocaleString()}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default Transacciones;
