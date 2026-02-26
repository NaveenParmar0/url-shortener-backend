import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

// Empty baseURL = relative requests → Vite proxy forwards /api/* to localhost:8080
// This avoids CORS entirely in development
const api = axios.create({
    baseURL: '',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const loginUser = (data) => api.post('/api/auth/public/login', data);
export const registerUser = (data) => api.post('/api/auth/public/register', data);

// URL APIs
export const shortenUrl = (originalUrl) => api.post('/api/urls/shorten', { originalUrl });
export const getMyUrls = () => api.get('/api/urls/myurls');
export const getUrlAnalytics = (shortUrl, startDate, endDate) =>
    api.get(`/api/urls/analytics/${shortUrl}`, { params: { startDate, endDate } });
export const getTotalClicks = (startDate, endDate) =>
    api.get('/api/urls/totalClicks', { params: { startDate, endDate } });

// Used for building redirect links (goes directly to backend)
export const getRedirectBase = () => BACKEND_URL;

export default api;
