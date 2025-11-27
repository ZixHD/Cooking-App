import { useState } from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Step } from "../../models/Recipe"



interface RecipeAccordionProps {
  steps: Step[];
}

const RecipeAccordion = ({ steps }: RecipeAccordionProps) => {

    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (index: number) => {
        if (openIndex === index) setOpenIndex(null)
        else setOpenIndex(index);
    }

   return (
    <FlatList
      data={steps}
      keyExtractor={(item) => item.stepNumber.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => toggle(index)}
          >
            <Text style={styles.headerText}>Step {item.stepNumber}</Text>
          </TouchableOpacity>

          {openIndex === index && (
            <View style={styles.content}>
              <Text style={styles.description}>{item.instruction}</Text>
              {item.media && (
                <Text>Media goes here</Text>
              )}
            </View>
          )}
        </View>
      )}
    />
  );
};



export default RecipeAccordion

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 12,
    backgroundColor: "#fff",
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});