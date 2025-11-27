import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import { fetchRecipes } from "../../services/AxiosRecipe"
import Recipe from "@/models/Recipe";
import { SafeAreaView } from "react-native-safe-area-context";


const RecipeListScreen = () => {

    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [search, setSearch] = useState("");

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

    const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      
      {/* HEADER */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity>
          
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 12 }}>
          Recipes
        </Text>

        {/* FILTER BUTTON */}
        <TouchableOpacity style={{ marginLeft: "auto" }}>
          
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search recipes..."
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 16,
        }}
      />

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/recipes/${item.id}`} asChild>
            <TouchableOpacity
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.title}</Text>
              <Text numberOfLines={2} style={{ color: "#666" }}>
                {item.description}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </SafeAreaView>
  );
};


export default RecipeListScreen