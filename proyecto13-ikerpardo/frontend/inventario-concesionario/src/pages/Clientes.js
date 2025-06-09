import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Clientes.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [nombreFiltro, setNombreFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/clientes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClientes(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los clientes');
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    const clientesFiltrados = clientes.filter((cliente) => 
        cliente.nombre?.toLowerCase().includes(nombreFiltro.toLowerCase())
    );

    if (loading) return <p>Cargando clientes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="clientes-container">
            <h1>Lista de Clientes</h1>
            <div className="clientes-filtro">
                <label htmlFor="nombreFiltro">Buscar por nombre: </label>
                <input
                    type="text"
                    id="nombreFiltro"
                    value={nombreFiltro}
                    onChange={(e) => setNombreFiltro(e.target.value)}
                />
            </div>
            <table className="clientes-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Compras</th>
                    </tr>
                </thead>
                <tbody>
                    {clientesFiltrados.map((cliente) => (
                        <tr key={cliente._id}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono || 'N/A'}</td>
                            <td>{cliente.direccion || 'N/A'}</td>
                            <td>{cliente.compras.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Clientes;
