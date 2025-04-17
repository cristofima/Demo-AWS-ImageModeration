import api from '../interceptors/axiosInstance';
import { Pagination } from '../models/pagination.model';

const apiService = {
    getImages: (page: number) => api.get<Pagination>(`/Posts?page=${page}&limit=12`),
    uploadImage: (data: FormData) => api.post(`/Posts`, data),
    deleteImage: (id: number) => api.delete(`/Posts/${id}`),
};

export default apiService;
