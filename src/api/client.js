import axios from 'axios';

const apiURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const serverInstance = axios.create({
    baseURL: `${apiURL}/api`,
    withCredentials: true
});

const refreshClient = axios.create({
    baseURL: `${apiURL}/api`,
    withCredentials: true
});

const refreshToken = async () => {
    try {
        const response = await refreshClient.post('/users/refresh-tokens/');

        console.log("refreshing tokens...");
        return response.data;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

serverInstance.interceptors.response.use(
    async response => {
        if (response.headers["x-token-refresh"] === "true") {

            const originalRequest = response?.config;

            if (originalRequest && !originalRequest._retry) {

                console.log("refreshing tokens...");
                originalRequest._retry = true;
                await refreshToken();
                return serverInstance(originalRequest);
            }
        }
        return response;
    },
    async(error) => {

        const status = error.response?.status;
        const originalRequest = error?.config;

        if ((status === 401 || status === 403 || status == 400) && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshToken();
                return serverInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login using hash route for GitHub Pages compatibility
                const baseRoute = import.meta.env.VITE_BASE_ROUTE || '/';
                window.location.href = `${baseRoute.replace(/\/$/, '')}/#/login`;
                // Optionally clear localStorage/sessionStorage here
                return Promise.reject(refreshError);
            }
            
        }

        return Promise.reject(error);
    }
);

export default serverInstance;