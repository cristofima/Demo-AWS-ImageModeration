import apiClient from "./api/apiClient";
import { Pagination, Post } from "../interfaces";
import { POSTS_LIMIT } from "../config/constants";

export interface UploadResponse {
  successful: {
    filename: string;
    post: Post;
  }[];
  failed: {
    filename: string;
    error: string;
  }[];
}

export const postService = {
  fetchPosts: (page: number) =>
    apiClient.get<Pagination>(`/Posts?page=${page}&limit=${POSTS_LIMIT}`),
  uploadPost: (data: FormData) => apiClient.post(`/Posts`, data),
  uploadMultiplePosts: (data: FormData) =>
    apiClient.post<UploadResponse>(`/Posts/batch`, data),
  deletePost: (id: number) => apiClient.delete(`/Posts/${id}`),
};
