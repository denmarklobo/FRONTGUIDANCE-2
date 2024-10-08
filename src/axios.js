import axios from 'axios';
import router from './router/index'; // Ensure this path is correct

const instance = axios.create({
    baseURL: 'http://26.11.249.89:8000',
});

instance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = Bearer ${token};
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.clear();
            router.push('/login'); // redirect to login page
        }
        return Promise.reject(error);
    }
);

export default instance;