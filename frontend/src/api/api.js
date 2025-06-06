import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});
export default api;