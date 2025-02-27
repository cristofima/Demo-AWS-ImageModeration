import axios from 'axios';
import { Pagination } from '../models/pagination,model';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiService = {
    getImages: (page: number) => axios.get<Pagination>(`${BASE_URL}/Posts?page=${page}&limit=8`),
    uploadImage: (data: FormData) => axios.post(`${BASE_URL}/Posts`, data),
    deleteImage: (id: string) => axios.delete(`${BASE_URL}/Posts/${id}`),
};

export default apiService;
