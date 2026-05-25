import { EquipmentInterface } from './EquipmentInterface';
import { OrderStatusInterface } from './OrderStatusInterface';
import { PartInterface } from './PartInterface';
import { UserInterface } from './UserInterface';

export interface OrderInterface {
  id: number;
  title: string;
  user_id: string;
  equipment_id: number;
  equipment: EquipmentInterface;
  total_price: number;
  parts_price: number;
  technician_id: number;
  technician: UserInterface;
  service_price: number;
  service_description: string;
  diagnostic: string;
  order_parts: PartInterface[];
  description: string;
  discount: number;
  obs: string;
  status_id: number;
  status: OrderStatusInterface;
  user: UserInterface;
  created_at: Date;
  updated_at: Date;
}
