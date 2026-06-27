import { UserInterface } from './UserInterface';

export interface RoomInterface {
  id: number;
  name: string;
  created_by: string;
  creator: UserInterface;
  created_at: Date;
  updated_at: Date;
}
