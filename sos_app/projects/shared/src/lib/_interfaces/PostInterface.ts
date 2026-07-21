import { UserInterface } from './UserInterface';

export interface PostInterface {
  id: number;
  title: string;
  content: string;
  user_id: number;
  user: UserInterface;
  created_at: string;
  updated_at: string;
}
