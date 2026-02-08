
export default interface Post {
    id: string,
    author_id: string,
    ratings: Rating[],
    text: string,
    views: number,
    createdAt: Date
}

interface Rating {
    user_id: string,
    score: number
}