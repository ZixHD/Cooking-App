import axios from "axios"
import { jwtDecode } from "jwt-decode";
import { attachAuthInterceptor } from "../utils/AuthMiddleware"; 


const apiRecipe = axios.create({
    baseURL: `https://unapparently-unworkmanly-darcey.ngrok-free.dev/api/posts`,
    headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true',
    },
})


attachAuthInterceptor(apiRecipe);


export const fetchRecipes = async () => {
    try{
        const response = await apiRecipe.get()
        return response.data;
    }catch (error) {
        console.error("Error fetching recipes: ", error);
        throw error;
    }
}

export const fetchRecipeById = async (id) => {
    try{
        const response = await apiRecipe.get(`/${id}`)
        return response.data
    }catch (error) {
        console.error("Error fetching recipe: ", error);
        throw error;
    }
}

export const filterRecipes = async(filterBody) => {
    console.log("Filter body:", filterBody);
    try{
        const response = await apiRecipe.post(`/filter`, filterBody)
        return response.data;
    }catch (error) {
        console.error("Error filtering recipe: ", error);
        throw error;
    }
}