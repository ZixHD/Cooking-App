import { Link } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchRecipes } from "../../services/AxiosPost";
import Recipe from "@/models/Recipe";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
import FilterModal from "@/components/recipe/filter";
import { fetchUserById } from "@/services/AxiosUser";
import User from "@/models/User";
import { jwtDecode } from "jwt-decode";
import { getToken } from "@/utils/AuthMiddleware";

const RecipeListScreen = () => {
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ✅ derive favorites safely
  const favorites = user?.favorites ?? [];

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken("jwt");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userId = decoded.sub;

        const data = await fetchUserById(userId);

        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          password: data.password || "",
          avatar: data.avatar || "",
          preferred_tags: data.preferred_tags || [],
          preferred_cuisine: data.preferred_cuisine || [],
          allergies: data.allergies || [],
          favorites: data.favorites || [],
        } as User);
      } catch (err) {
        console.log("Failed to fetch user:", err);
      }
    };

    loadUser();
  }, []);

  // Load recipes
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

    let result = allRecipes.filter((r) =>
      r.title.toLowerCase().includes(lower)
    );

    if (showFavorites) {
      result = result.filter((r) =>
        favorites.includes(r.id.toString())
      );
    }

    setFilteredRecipes(result);
  }, [search, allRecipes, showFavorites, favorites]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: "row", marginBottom: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Recipes</Text>

        {Platform.OS === "web" && (
          <Link href="/recipes/create-recipe" asChild>
            <TouchableOpacity
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
          onPress={() => setShowFavorites(!showFavorites)}
          style={{
            marginLeft: 10,
            backgroundColor: showFavorites ? "gold" : "#888",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white" }}>
            {showFavorites ? "Favorites ✓" : "Favorites"}
          </Text>
        </TouchableOpacity>

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
              testID="recipe-item"
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
        onApply={(recipes: SetStateAction<Recipe[]>) =>
          setFilteredRecipes(recipes)
        }
        initialSearch={search}
      />
    </SafeAreaView>
  );
};

export default RecipeListScreen;
