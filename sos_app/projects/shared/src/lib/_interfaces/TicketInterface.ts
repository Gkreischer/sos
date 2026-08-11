import { OrderStatusInterface } from './OrderStatusInterface';
import { UserInterface } from './UserInterface';
import { EquipmentInterface } from './EquipmentInterface';
import { OrderInterface } from './OrderInterface';
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
  order_id?: number | null;
  order?: OrderInterface | null;
  created_at: Date;
  updated_at: Date;
}
