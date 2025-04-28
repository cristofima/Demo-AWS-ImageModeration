import apiClient from "./api/apiClient";
import { Pagination } from "../interfaces";
import { POSTS_LIMIT } from "../config/constants";

export const postService = {
  fetchPosts: (page: number) =>
    apiClient.get<Pagination>(`/Posts?page=${page}&limit=${POSTS_LIMIT}`),
  uploadPost: (data: FormData) => apiClient.post(`/Posts`, data),
  deletePost: (id: number) => apiClient.delete(`/Posts/${id}`),
};
