import { Link } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { fetchRecipes } from "../services/AxiosRecipe";
import Recipe from "@/models/Recipe";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native"
import FilterModal from "@/components/recipe/filter";

const RecipeListScreen = () => {
  const [search, setSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const getRecipes = async () => {
      const response = await fetchRecipes();
      setAllRecipes(response as Recipe[]);
      setFilteredRecipes(response as Recipe[]);
    };
    getRecipes();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredRecipes(
      allRecipes.filter((r) => r.title.toLowerCase().includes(lower))
    );
  }, [search, allRecipes]);


  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
     
      <View style={{ flexDirection: "row", marginBottom: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Recipes</Text>

        {Platform.OS === "web" && (
        <Link href = "/recipes/create-recipe" asChild>
          <TouchableOpacity
            onPress={() => console.log("123")}
            style={{
              marginLeft: 16,
              backgroundColor: "#007bff",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white" }}>Create Post</Text>
          </TouchableOpacity>
          </Link>
        )}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            marginLeft: "auto",
            backgroundColor: "#333",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white" }}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search recipes..."
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/recipes/${item.id}`} asChild>
            <TouchableOpacity
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {item.title}
              </Text>
              <Text numberOfLines={2}>{item.description}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
        <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={(recipes: SetStateAction<Recipe[]>) => setFilteredRecipes(recipes)}
        initialSearch={search}
      />

     


    </SafeAreaView>
  );
};

export default RecipeListScreen;