import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Inicio from '../pages/Inicio';
import Vehiculos from '../pages/Vehiculos';
import Clientes from '../pages/Clientes';
import Transacciones from '../pages/Transacciones';
import Login from '../pages/Login';

const AppRouter = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Simulamos una carga inicial para evitar redirección inmediata
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            clearTimeout(timer);
        };
    }, []);

    // Revisamos si el token está vacío y evitamos cambios innecesarios de estado
    useEffect(() => {
        if (!token) {
            setLoading(false); // Si no hay token, no estamos cargando
        }
    }, [token]);

    const loginUser = (userToken) => {
        // Aquí puedes hacer la autenticación real y luego actualizar el estado de token
        setToken(userToken);
        localStorage.setItem('token', userToken); // Guardar el token en localStorage
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login loginUser={loginUser} />} />
                <Route path="/" element={token ? <Inicio /> : <Navigate to="/login" replace />} />
                <Route path="/vehiculos" element={token ? <Vehiculos /> : <Navigate to="/login" replace />} />
                <Route path="/clientes" element={token ? <Clientes /> : <Navigate to="/login" replace />} />
                <Route path="/transacciones" element={token ? <Transacciones /> : <Navigate to="/login" replace />} />
            </Routes>
        </>
    );
};

export default AppRouter;
