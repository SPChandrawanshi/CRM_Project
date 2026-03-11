import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Diagnostic logs for local development verification
if (import.meta.env.DEV) {
    console.log('[API] Target:', API_URL);
    console.log('[Socket] Target:', SOCKET_URL);
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ─── Interceptors ────────────────────────────────────────────────────────────

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

api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                isRefreshing = false;
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                const { token } = response.data.data || response.data; // Handle both nested and flat response

                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                originalRequest.headers.Authorization = `Bearer ${token}`;

                processQueue(null, token);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Standardize error reporting while preserving the error object for hooks
        const message = error.response?.data?.message || error.message || 'An error occurred';
        if (error.response?.data) {
            error.response.data.message = message; // Ensure message is easily accessible
        }
        return Promise.reject(error);
    }
);

// ─── Socket.io ────────────────────────────────────────────────────────────────

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    auth: (cb) => {
        cb({ token: localStorage.getItem('token') });
    }
});

export const connectSocket = (role) => {
    if (!socket.connected) {
        socket.connect();
    }
    socket.on('connect', () => {
        console.log('[Socket] Connected:', socket.id);
        if (role) {
            socket.emit('join:room', role.toUpperCase().replace(' ', '_'));
        }
    });
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

if (localStorage.getItem('token')) {
    connectSocket();
}

export default api;


