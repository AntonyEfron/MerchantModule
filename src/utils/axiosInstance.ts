import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.102:5000/api/', // no trailing slash
  timeout: 10000,
});

export default axiosInstance;