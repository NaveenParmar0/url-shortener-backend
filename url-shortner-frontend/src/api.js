import axios from 'axios';

const BACKEND_URL = 'https://url-shortener-backend-ikye.onrender.com';

// Use the Render backend URL directly (CorsConfig.java allows this origin)
const api = axios.create({
    baseURL: BACKEND_URL,
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

// Used for building redirect links (goes to the deployed backend)
export const getRedirectBase = () => BACKEND_URL;

export default api;
