import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api', // Cambia esto por el URL del backend en producción
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
