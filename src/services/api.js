import axios from 'axios';
const api = axios.create({
    baseURL: 'https://ssapifrs.herokuapp.com',
})
export default api;