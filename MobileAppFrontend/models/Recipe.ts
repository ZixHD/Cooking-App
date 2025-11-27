
export default interface Recipe {
    id: string,
    title: string,
    author_id: string,
    description: string,
    ingredients: Ingredient[] 
}

interface Ingredient {
    name: string,
    quantity: string
}

interface Step {
    step_number: number,
    instruction: string,
    media: string
}