import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Inicio from '../pages/Inicio';
import Vehiculos from '../pages/Vehiculos';
import Clientes from '../pages/Clientes';
import Transacciones from '../pages/Transacciones';
import Login from '../pages/Login';

const AppRouter = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/vehiculos" element={<Vehiculos />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/transacciones" element={<Transacciones />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
