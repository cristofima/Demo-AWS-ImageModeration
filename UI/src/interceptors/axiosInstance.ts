import axios from "axios";
import { fetchAuthSession } from "@aws-amplify/auth";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session?.tokens?.idToken;
    config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.warn("No token found or user not authenticated");
  }
  return config;
});

export default api;
