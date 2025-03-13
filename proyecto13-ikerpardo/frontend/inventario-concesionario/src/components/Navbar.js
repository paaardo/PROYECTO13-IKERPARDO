import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      
      {token && (
        <>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
        Inicio
      </NavLink>
          <NavLink to="/vehiculos" className={({ isActive }) => (isActive ? 'active' : '')}>
            Vehículos
          </NavLink>
          {rol === 'admin' && (
            <>
              <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'active' : '')}>
                Clientes
              </NavLink>
              <NavLink to="/transacciones" className={({ isActive }) => (isActive ? 'active' : '')}>
                Transacciones
              </NavLink>
            </>
          )}
        </>
      )}
      <div className="navbar-right">
        {!token ? (
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
            Identificarse
          </NavLink>
        ) : (
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
