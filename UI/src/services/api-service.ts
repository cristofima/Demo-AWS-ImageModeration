import axios from 'axios';
import { Image } from "../models/image.model";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiService = {
    getImages: () => axios.get<Image[]>(`${BASE_URL}/Posts`),
    uploadImage: (data: FormData) => axios.post(`${BASE_URL}/Posts`, data),
    deleteImage: (id: string) => axios.delete(`${BASE_URL}/Posts/${id}`),
};

export default apiService;
