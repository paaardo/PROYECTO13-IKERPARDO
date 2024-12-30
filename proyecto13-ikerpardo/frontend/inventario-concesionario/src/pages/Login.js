import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [isLoginMode, setIsLoginMode] = useState(true); // Estado para alternar entre Login y Registro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('usuario');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLoginMode) {
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                    email,
                    password,
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('rol', response.data.rol);
                navigate('/vehiculos');
            } else {
                await axios.post('http://localhost:5000/api/auth/registrar', {
                    nombre,
                    email,
                    password,
                    rol,
                });
                alert('Usuario registrado con éxito. Por favor, inicia sesión.');
                setIsLoginMode(true);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al procesar la solicitud.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>{isLoginMode ? 'Iniciar Sesión' : 'Registrar Usuario'}</h1>
                {error && <p className="error">{error}</p>}
                {!isLoginMode && (
                    <>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Introduce tu nombre"
                            required
                        />
                        <label htmlFor="rol">Rol</label>
                        <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)} required>
                            <option value="usuario">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                    </>
                )}
                <label htmlFor="email">Correo Electrónico</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduce tu correo"
                    required
                />
                <label htmlFor="password">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduce tu contraseña"
                    required
                />
                <button type="submit">{isLoginMode ? 'Ingresar' : 'Registrar'}</button>
                <button
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="toggle-mode-button"
                >
                    {isLoginMode ? 'Crear cuenta nueva' : 'Ya tengo una cuenta'}
                </button>
            </form>
        </div>
    );
};

export default Login;
