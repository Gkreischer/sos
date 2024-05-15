import { Category } from "./Category";

export interface Part {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category_id: number;
    category: Category;
    description: string;
    image: string;
}