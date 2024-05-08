import { Category } from './Category';
import { Image } from './Image';
import { Part } from './Part';
import { User } from './User';
export interface Equipment {
  id: number;
  name: string;
  description: string;
  image: Image[];
  user: User;
  category_id: number;
  parts: Part[];
  category: Category;
  created_at: Date;
  updated_at: Date;
}
