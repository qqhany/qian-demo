import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: 'http://192.168.72.255:3000',
});

// Request interceptor - automatically add JWT token
instance.interceptors.request.use(async (config) => {
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - handle token expiration
instance.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        console.log('❌ API Error:', error.response?.status, error.config?.url, error.message);
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token expired or invalid, clear local storage
            await AsyncStorage.removeItem('token');

            // Note: We can't directly navigate here due to React Native limitations
            // The navigation will be handled in the component that uses this axios instance
        }
        return Promise.reject(error);
    }
);

export default instance; 