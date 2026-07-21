import { OrderStatusInterface } from './OrderStatusInterface';
import { UserInterface } from './UserInterface';

export interface TicketInterface {
  id: number;
  title: string;
  description: string;
  status_id: number;
  status: OrderStatusInterface;
  user_id: number;
  user: UserInterface;
  created_at: Date;
  updated_at: Date;
}
