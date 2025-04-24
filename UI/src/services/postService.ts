import apiClient from "./api/apiClient";
import { Pagination } from "../interfaces";

export const postService = {
  fetchPosts: (page: number) =>
    apiClient.get<Pagination>(`/Posts?page=${page}&limit=12`),
  uploadPost: (data: FormData) => apiClient.post(`/Posts`, data),
  deletePost: (id: number) => apiClient.delete(`/Posts/${id}`),
};
