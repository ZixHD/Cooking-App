import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";


export const storeToken = async (key, value) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

export const getToken = async (key) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const removeToken = async (key) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};
export const attachAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
    const token = await getToken("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};