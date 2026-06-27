import { CategoryInterface } from './CategoryInterface';

export interface PartInterface {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category_id: number;
  category: CategoryInterface;
  description: string;
  image: string;
}
