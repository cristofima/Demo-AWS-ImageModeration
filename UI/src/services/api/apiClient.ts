import axios, { AxiosInstance } from "axios";
import { setUpRequestInterceptor } from "./requestInterceptor";
import { getEnvVar } from "../../utils/env";

const API_BASE_URL = getEnvVar("VITE_API_BASE_URL");

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

setUpRequestInterceptor(apiClient);

export default apiClient;
