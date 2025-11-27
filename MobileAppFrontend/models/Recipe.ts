
export default interface Recipe {
    id: string,
    title: string,
    author_id: string,
    description: string,
    ingredients: Ingredient[],
    steps: Step[],
    tags: string[],
    cuisine: string[],
    allergies: string[]
    difficulty: string,
    prep_time: number,
    calories: number

}

export interface Ingredient {
    name: string,
    quantity: string
}

export interface Step {
    stepNumber: number,
    instruction: string,
    media: string
}