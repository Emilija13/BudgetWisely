import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', 
});

// Axios Interceptor to add JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem('jwtToken');

    if (jwtToken) {
      config.headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor to handle token expiration or unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        const navigate = useNavigate(); 
        navigate('/login'); 

        localStorage.removeItem('jwtToken');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
