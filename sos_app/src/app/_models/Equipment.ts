import { Category } from './Category';
import { Image } from './Image';
import { User } from './User';
export interface Equipment {
  id: number;
  name: string;
  description: string;
  image: Image[];
  user: User;
  category_id: number;
  category: Category;
  created_at: Date;
  updated_at: Date;
}
