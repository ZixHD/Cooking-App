import { Alert, Platform } from "react-native";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { createRecipe } from "@/services/AxiosPost";


const CreateRecipeForm = () => {
  if (Platform.OS !== "web") return null; 

  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [calories, setCalories] = useState("");
  const [text, setText] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([
  { stepNumber: 1, instruction: "", media: "" },
]);
  const [ratings, setRatings] = useState([
    { userId: "", score: 0 }
  ]);
  const [tags, setTags] = useState([""]);
  const [allergies, setAllergies] = useState([""]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

  const postBody = {
    title,
    authorId,
    description,
    cuisine,
    difficulty,
    prep_time: Number(prepTime),
    calories: Number(calories),
    text,

    ingredients: ingredients.filter(i => i.name),
    steps: steps.filter(s => s.instruction),
    tags: tags.filter(t => t),
    allergies: allergies.filter(a => a),

    ratings: ratings.filter(r => r.userId && r.score > 0), 
  };




    setTitle("");
    setAuthorId("");
    setDescription("");
    setCuisine("");
    setDifficulty("");
    setPrepTime("");
    setCalories("");
    setIngredients([{ name: "", quantity: "" }]);
    setSteps([{ stepNumber: 1, instruction: "", media: "" }]);
    setTags([""]);
    setAllergies([""]);
    setText("");

    try {
      const result = await createRecipe(postBody);
      console.log("Recipe created successfully:", result);
      Alert.alert("Success", "Recipe posted!");


      setTitle(""); setAuthorId(""); setDescription("");
      setCuisine(""); setDifficulty(""); setPrepTime(""); setCalories(""); setText("");
      setIngredients([{ name: "", quantity: "" }]);
      setSteps([{ stepNumber: 1, instruction: "", media: "" }]); setTags([""]); setAllergies([""]);
    } catch (error) {
      console.error("Error posting recipe:", error);
      Alert.alert("Error", "Could not post recipe");
    }
  };

  const updateIngredient = (index: number, key: "name" | "quantity", value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][key] = value;
    setIngredients(newIngredients);
  };

  const updateStep = (
    index: number,
    key: "instruction" | "media",
    value: string
  ) => {
    const newSteps = [...steps];
    newSteps[index][key] = value;
    newSteps[index].stepNumber = index + 1;
    setSteps(newSteps);
  };  

  const updateArrayField = (setter: any, index: number, value: string) => {
    const arr = [...setter[0]];
    arr[index] = value;
    setter[1](arr);
  };

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#f9f9f9" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>Create Recipe</Text>

      <TextInput placeholder="Text" value={text} onChangeText={setText} style={inputStyle}/>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={inputStyle} />
      <TextInput placeholder="Author ID" value={authorId} onChangeText={setAuthorId} style={inputStyle} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={inputStyle} multiline testID="create-description"/>
      <TextInput placeholder="Cuisine" value={cuisine} onChangeText={setCuisine} style={inputStyle} />
      <TextInput placeholder="Difficulty" value={difficulty} onChangeText={setDifficulty} style={inputStyle} />
      <TextInput placeholder="Prep Time (minutes)" value={prepTime} onChangeText={setPrepTime} keyboardType="numeric" style={inputStyle} />
      <TextInput placeholder="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" style={inputStyle} />

      <Text style={{ fontWeight: "600", marginTop: 16 }}>Ingredients:</Text>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
          <TextInput
            placeholder="Name"
            value={ingredient.name}
            onChangeText={(v) => updateIngredient(index, "name", v)}
            style={[inputStyle, { flex: 1 }]}
          />
          <TextInput
            placeholder="Quantity"
            value={ingredient.quantity}
            onChangeText={(v) => updateIngredient(index, "quantity", v)}
            style={[inputStyle, { flex: 1 }]}
          />
        </View>
      ))}
      <TouchableOpacity onPress={() => setIngredients([...ingredients, { name: "", quantity: "" }])} style={addButtonStyle}>
        <Text style={{ color: "white" }}>+ Add Ingredient</Text>
      </TouchableOpacity>

      {/* Steps */}
      {/* Steps */}
<Text style={{ fontWeight: "600", marginTop: 16 }}>Steps:</Text>

{steps.map((step, index) => (
  <View key={index} style={{ marginBottom: 8 }}>
    <TextInput
      placeholder={`Instruction ${index + 1}`}
      value={step.instruction}
      onChangeText={(v) => updateStep(index, "instruction", v)}
      style={inputStyle}
    />

    <TextInput
      placeholder="Media URL (optional)"
      value={step.media}
      onChangeText={(v) => updateStep(index, "media", v)}
      style={inputStyle}
    />
  </View>
    ))}

    <TouchableOpacity
      onPress={() =>
        setSteps([
          ...steps,
          { stepNumber: steps.length + 1, instruction: "", media: "" },
        ])
      }
      style={addButtonStyle}
    >
      <Text style={{ color: "white" }}>+ Add Step</Text>
    </TouchableOpacity>

      {/* Tags */}
      <Text style={{ fontWeight: "600", marginTop: 16 }}>Tags:</Text>
      {tags.map((tag, index) => (
        <TextInput
          key={index}
          placeholder={`Tag ${index + 1}`}
          value={tag}
          onChangeText={(v) => setTags(tags.map((t, i) => (i === index ? v : t)))}
          style={inputStyle}
        />
      ))}
      <TouchableOpacity onPress={() => setTags([...tags, ""])} style={addButtonStyle}>
        <Text style={{ color: "white" }}>+ Add Tag</Text>
      </TouchableOpacity>

      {/* Allergies */}
      <Text style={{ fontWeight: "600", marginTop: 16 }}>Allergies:</Text>
      {allergies.map((a, i) => (
        <TextInput
          key={i}
          placeholder={`Allergy ${i + 1}`}
          value={a}
          onChangeText={(v) => setAllergies(allergies.map((al, idx) => (idx === i ? v : al)))}
          style={inputStyle}
        />
      ))}
      <TouchableOpacity onPress={() => setAllergies([...allergies, ""])} style={addButtonStyle}>
        <Text style={{ color: "white" }}>+ Add Allergy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} style={{ ...addButtonStyle, marginTop: 24 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Post Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateRecipeForm;

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 10,
  borderRadius: 8,
  marginBottom: 8,
  backgroundColor: "#fff",
};

const addButtonStyle = {
  backgroundColor: "#007bff",
  padding: 10,
  borderRadius: 8,
  alignItems: "center",
  marginBottom: 12,
} as const;