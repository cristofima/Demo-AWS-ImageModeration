import axios, { AxiosInstance } from "axios";
import { setUpRequestInterceptor } from "./requestInterceptor";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

setUpRequestInterceptor(apiClient);

export default apiClient;
