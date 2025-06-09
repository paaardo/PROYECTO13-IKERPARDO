import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import Inicio from '../pages/Inicio';
import Vehiculos from '../pages/Vehiculos';
import Clientes from '../pages/Clientes';
import Transacciones from '../pages/Transacciones';
import Login from '../pages/Login';

const AppRouter = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // ✅ Validar expiración del token
    useEffect(() => {
        const verificarToken = () => {
            try {
                if (token) {
                    const decoded = jwtDecode(token);
                    const ahora = Date.now() / 1000;

                    if (decoded.exp < ahora) {
                        // Token expirado
                        localStorage.removeItem('token');
                        localStorage.removeItem('rol');
                        setToken(null);
                        return;
                    }
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('rol');
                setToken(null);
            }
        };

        verificarToken();

        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [token]);

    const loginUser = (userToken) => {
        setToken(userToken);
        localStorage.setItem('token', userToken);
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
