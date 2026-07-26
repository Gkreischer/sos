import { OrderStatusInterface } from './OrderStatusInterface';
import { UserInterface } from './UserInterface';
import { EquipmentInterface } from './EquipmentInterface';
export interface TicketInterface {
  id: number;
  title: string;
  description: string;
  status_id: number;
  status: OrderStatusInterface;
  user_id: number;
  user: UserInterface;
  equipment_id: number;
  equipment: EquipmentInterface;
  created_at: Date;
  updated_at: Date;
}
