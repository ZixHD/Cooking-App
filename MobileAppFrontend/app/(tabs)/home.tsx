import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { fetchRecipes } from "../../services/AxiosRecipe"
import Recipe from "@/models/Recipe";


const RecipeListScreen = () => {

    const [recipes, setRecipes] = useState<Recipe[] | null>(null)

    useEffect(() => {
        const getRecipes = async () => {
            try{
                const response = await fetchRecipes()
                setRecipes(response as Recipe[])
            }catch (error){
                console.error("Error fetching recipes: ", error)
            }
        };
        getRecipes();

    }, [])


    return (
        <View>
            <FlatList
                data = {recipes}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                <TouchableOpacity>
                    
                        <Text>{item.title}</Text>
                        <Text numberOfLines={2}>{item.description}</Text>
                    
                </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default RecipeListScreen