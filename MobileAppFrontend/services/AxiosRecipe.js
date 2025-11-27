import axios from "axios"
import { jwtDecode } from "jwt-decode";

const apiRecipe = axios.create({
    baseURL: `https://unapparently-unworkmanly-darcey.ngrok-free.dev/api/recipes`,
    headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true',
    },
})

// apiBanking.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;

//         // For debugging - remove in production
//         console.log(
//             `${config.method.toUpperCase()} ${
//                 config.url
//             } - Token: ${token.substring(0, 20)}...`
//         );
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
// );


export const fetchRecipes = async () =>{
    try{
        const response = await apiRecipe.get()
        return response.data;
    }catch (error) {
        console.error("Error fetching recipes: ", error);
        throw error;
    }
}
