import { attachAuthInterceptor } from "@/utils/AuthMiddleware";
import axios from "axios"


const apiRecipe = axios.create({
    baseURL: `https://unapparently-unworkmanly-darcey.ngrok-free.dev/api/users`,
    headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true',
    },
})

attachAuthInterceptor(apiRecipe);

export const fetchUserById = async (id) => {
    try{
        console.log("UserId ", id)
        const response = await apiRecipe.get(`/${id}`)
        return response.data;
    }catch (error) {
        console.error("Error fetching recipes: ", error);
        throw error;
    }
}

export const updateUser = async (id, body) => {
    try{
        console.log("Body ", body)
        const response = await apiRecipe.put(`/edit/${id}`, body)
        return response.data;
    }catch (error) {
        console.error("Error fetching recipes: ", error);
        throw error;
    }
}