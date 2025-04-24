import { AxiosInstance } from "axios";
import { fetchAuthSession } from "@aws-amplify/auth";

export const setUpRequestInterceptor = (apiClient: AxiosInstance): void => {
  apiClient.interceptors.request.use(
    async (config) => {
      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );
};
