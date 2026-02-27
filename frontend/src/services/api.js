import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling and automatic refresh
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;
        const message = error.response?.data?.message || 'Something went wrong';

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Try to get a new access token
                    const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                    const newToken = response.data.token;

                    localStorage.setItem('token', newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Re-run the original request with new token
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh token failed → force logout
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } else {
                // No refresh token → clear everything
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(message);
    }
);

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: (cb) => {
        cb({ token: localStorage.getItem('token') });
    }
});

export default api;
