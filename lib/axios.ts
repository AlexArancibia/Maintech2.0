import axios from "axios";



const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api