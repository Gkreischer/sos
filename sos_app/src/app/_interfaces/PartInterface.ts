import { CategoryInterface } from './CategoryInterface';

export interface PartInterface {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category_id: number;
  category: CategoryInterface;
  description: string;
  image: string;
}
