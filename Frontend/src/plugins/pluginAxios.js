import axios from 'axios';

const apiClient = axios.create({
    // baseURL: 'https://backendretofactus-production.up.railway.app/api',
    baseURL: 'http://localhost:5000/api',
});

export { apiClient };