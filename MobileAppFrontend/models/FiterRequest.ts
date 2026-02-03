export default interface RecipeFilterRequest {
  minCalories?: number | null;
  maxCalories?: number | null;
  minPrepTime?: number | null;
  maxPrepTime?: number | null;
  allergies?: string[] | null;
  tags?: string[] | null;
  difficulty?: string | null;
  cuisine?: string | null;
}