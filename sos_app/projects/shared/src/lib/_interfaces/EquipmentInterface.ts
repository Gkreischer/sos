import { CategoryInterface } from './CategoryInterface';
import { ImageInterface } from './ImageInterface';
import { PartInterface } from './PartInterface';
import { UserInterface } from './UserInterface';
export interface EquipmentInterface {
  id: number;
  name: string;
  description: string;
  image: ImageInterface[];
  user: UserInterface;
  category_id: number;
  parts: PartInterface[];
  category: CategoryInterface;
  created_at: Date;
  updated_at: Date;
}
