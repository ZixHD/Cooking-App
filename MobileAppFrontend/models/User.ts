
export default interface User {
    id: string,
    username: string,
    email: string,
    password: string,
    avatar: string,
    preferred_tags: string[],
    preferred_cuisine: string[],
    allergies: string[],
    favorites: string[]
}