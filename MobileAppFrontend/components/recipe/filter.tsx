// components/FilterModal.tsx
import React, { useState } from "react";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { filterRecipes } from "@/services/AxiosRecipe";
import RecipeFilterRequest from "@/models/FiterRequest";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (recipes: any[]) => void; // or Recipe[]
  initialSearch?: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [minPrepTime, setMinPrepTime] = useState("");
  const [maxPrepTime, setMaxPrepTime] = useState("");
  const [allergies, setAllergies] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cuisine, setCuisine] = useState("");

  const applyFilters = async () => {
    try {
      const body: RecipeFilterRequest = {
        minCalories: minCalories ? Number(minCalories) : null,
        maxCalories: maxCalories ? Number(maxCalories) : null,
        minPrepTime: minPrepTime ? Number(minPrepTime) : null,
        maxPrepTime: maxPrepTime ? Number(maxPrepTime) : null,
        allergies: allergies
          ? allergies.split(",").map((s) => s.trim())
          : null,
        tags: tags ? tags.split(",").map((s) => s.trim()) : null,
        difficulty: difficulty || null,
        cuisine: cuisine || null
      };

      const filtered = await filterRecipes(body);
      onApply(filtered);
      onClose();
    } catch (err) {
      console.error("Error applying filters", err);
    }
  };

  const resetFilters = () => {
    setMinCalories("");
    setMaxCalories("");
    setMinPrepTime("");
    setMaxPrepTime("");
    setAllergies("");
    setTags("");
    setDifficulty("");
    setCuisine("");
  };

  const handleClose = () => {
    resetFilters();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              margin: 20,
              borderRadius: 12,
              padding: 20,
              maxHeight: "90%",
            }}
          >
            <ScrollView>
              <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
                Filter Recipes
              </Text>

              <TextInput
                placeholder="Min Calories"
                value={minCalories}
                onChangeText={setMinCalories}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Max Calories"
                value={maxCalories}
                onChangeText={setMaxCalories}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Min Prep Time"
                value={minPrepTime}
                onChangeText={setMinPrepTime}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Max Prep Time"
                value={maxPrepTime}
                onChangeText={setMaxPrepTime}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Allergies (comma separated)"
                value={allergies}
                onChangeText={setAllergies}
                style={styles.input}
              />
              <TextInput
                placeholder="Tags (comma separated)"
                value={tags}
                onChangeText={setTags}
                style={styles.input}
              />
              <TextInput
                placeholder="Difficulty"
                value={difficulty}
                onChangeText={setDifficulty}
                style={styles.input}
              />
              <TextInput
                placeholder="Cuisine"
                value={cuisine}
                onChangeText={setCuisine}
                style={styles.input}
              />

              <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
               <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Apply Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClose} style={{ padding: 12 }}>
                <Text style={{ textAlign: "center", color: "red" }}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  applyButton: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  applyText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default FilterModal;