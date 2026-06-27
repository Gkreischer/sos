import { UserInterface } from './UserInterface';

export interface RoomMessageInterface {
  id: number;
  content: string;
  room_id: number;
  user_id: number;
  user: UserInterface;
  created_at: Date;
  updated_at: Date;
}
