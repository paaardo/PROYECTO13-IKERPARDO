import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ loginUser }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('usuario');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordError('');

        if (!isLoginMode && password !== verifyPassword) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        try {
            if (isLoginMode) {
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                    email,
                    password,
                });
                // Llamamos a loginUser para actualizar el token en el estado y localStorage
                loginUser(response.data.token);
                navigate('/');  // Redirige a la página de inicio después de login exitoso
            } else {
                await axios.post('http://localhost:5000/api/auth/registrar', {
                    nombre,
                    email,
                    password,
                    rol,
                });
                setSuccess('Usuario registrado correctamente');
                setTimeout(() => {
                    setSuccess('');
                    setIsLoginMode(true);
                    setPassword('');
                    setVerifyPassword('');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al procesar la solicitud.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && window.location.pathname !== '/') {
            navigate('/'); // Redirige solo si no estamos en la página de inicio
        }
    }, [navigate]);

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>{isLoginMode ? 'Iniciar Sesión' : 'Registrar Usuario'}</h1>
                {error && <p className="error center-text">{error}</p>}
                {success && <p className="success center-text">{success}</p>}
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
                {!isLoginMode && (
                    <>
                        <label htmlFor="verifyPassword">Verificar Contraseña</label>
                        <input
                            type="password"
                            id="verifyPassword"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                            required
                        />
                        {passwordError && <p className="error center-text">{passwordError}</p>}
                    </>
                )}
                <button type="submit">{isLoginMode ? 'Ingresar' : 'Registrar'}</button>
                <button
                    type="button"
                    onClick={() => {setIsLoginMode(!isLoginMode);
                        setEmail('');
                        setPassword('');
                        setNombre('');
                        setRol('usuario');
                        setVerifyPassword('');
                        setError('');
                        setPasswordError('');
                    }}
                    className="toggle-mode-button"
                >
                    {isLoginMode ? 'Crear cuenta nueva' : 'Ya tengo una cuenta'}
                </button>
            </form>
        </div>
    );
};

export default Login;
