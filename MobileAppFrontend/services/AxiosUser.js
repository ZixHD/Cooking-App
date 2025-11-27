import axios from "axios"
import { jwtDecode } from "jwt-decode";

const apiRecipe = axios.create({
    baseURL: `https://unapparently-unworkmanly-darcey.ngrok-free.dev/api/users`,
    headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true',
    },
})


export const fetchUserById = async (id) => {
    try{
        const response = await apiRecipe.get(`/${id}`)
        return response.data;
    }catch (error) {
        console.error("Error fetching recipes: ", error);
        throw error;
    }
}