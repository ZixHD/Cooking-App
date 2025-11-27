import RecipeAccordion from "@/components/recipe/accordion"
import Recipe from "@/models/Recipe"
import User from "@/models/User"
import { fetchRecipeById } from "@/services/AxiosRecipe"
import { fetchUserById} from "@/services/AxiosUser"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"


const RecipeDetails = () => {

    const { id } = useLocalSearchParams()
    const [recipe, setRecipe] = useState<Recipe | null>(null);    
    const [user, setUser] = useState<User | null >(null)
    const [loading, setLoading] = useState(true)
    


    useEffect(() => {
        const load = async() => {
            try{
                const recipeData = await fetchRecipeById(id);
                setRecipe(recipeData)

                if (recipeData.author_id) {
                    const userData = await fetchUserById(recipeData.author_id);
                    setUser(userData);
                }
            }finally{
                setLoading(false)
            }
        };
        load()
    }, [id]);

    

    if (loading && recipe == null) return <ActivityIndicator style={{ marginTop: 40 }} />;


    return (

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe?.title}</Text>
      <Text style={styles.description}>Author: {user?.username}</Text>
      <Text style={styles.description}>{recipe?.description}</Text>

       {recipe?.tags && recipe?.tags.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Tags:</Text>
          <View style={styles.chipsContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionHeader}>Ingredients:</Text>
      <View style={styles.ingredientContainer}>
        {recipe?.ingredients.map((ingredient, index) => (
         <View key={index} style={styles.ingredient}>
            <Text style={styles.chipText}>{ingredient.name}</Text>
            <Text style={styles.chipText}>{ingredient.quantity}</Text>
        </View>
        ))}
      </View>

      <Text style={styles.sectionHeader}>Cooking time:</Text>
      <Text style={styles.normalText}>{recipe?.prep_time} min</Text>
      <Text style={styles.normalText}>Cuisine: {recipe?.cuisine}</Text>
      
      <View style={styles.ingredientContainer}>
        {recipe?.allergies.map((allergie, index) => (
         <View key={index} style={styles.ingredient}>
            <Text style={styles.chipText}>Allergies: {allergie}</Text>
        </View>
        ))}
      </View>

      <Text style={styles.normalText}>Difficulty: {recipe?.difficulty}</Text>
      <Text style={styles.normalText}>Calories: {recipe?.calories}kcal</Text>


      <Text style={styles.sectionHeader}>Steps:</Text>
      <RecipeAccordion steps={recipe?.steps ?? []}/>

      
     
    </ScrollView>
  )
}




export default  RecipeDetails

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loading: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  normalText: {
    fontSize: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, 
  },
  ingredientContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 5
  },
  ingredient: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  chip: {
    backgroundColor: "#eee",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
  },
})