import axios from 'axios';

const instance = axios.create({
    baseURL: `http://localhost:5000/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Interceptar respuestas 401
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;
