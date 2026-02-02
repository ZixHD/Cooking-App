import { storeToken } from "@/utils/AuthMiddleware";
import axios from "axios"
import * as SecureStore from "expo-secure-store";

const apiRecipe = axios.create({
    baseURL: `https://unapparently-unworkmanly-darcey.ngrok-free.dev/auth`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'ngrok-skip-browser-warning': 'true',
    },
})


export const login = async (loginData) => {
  try {
    console.log("LoginData:", loginData);

    const response = await apiRecipe.post("/login", loginData);

    const token = response.data 

    if (!token) {
      throw new Error("No token received from server");
    }
    console.log("Token", token)
    
    await storeToken("jwt", token);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Login failed:", error.response.status, error.response.data);
    } else {
      console.error("Network or other error:", error.message);
    }
    throw error;
  }
};
