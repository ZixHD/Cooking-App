import { Ingredient, Step } from "./Recipe"

export default interface CreatePost{
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
    calories: number,
    ratings: Rating[],
    text: string,
    
}

export interface Rating{
    userId: string,
    score: number
}