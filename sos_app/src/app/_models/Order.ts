import { Equipment } from './Equipment';
import { OrderStatus } from './OrderStatus';
import { Part } from './Part';
import { User } from './User';

export interface Order {
  id: number;
  title: string;
  user_id: string;
  equipment_id: number;
  equipment: Equipment;
  total_price: number;
  parts_price: number;
  technician_id: number;
  technician: User;
  service_price: number;
  service_description: string;
  diagnostic: string;
  order_parts: Part[];
  description: string;
  discount: number;
  obs: string;
  status_id: number;
  status: OrderStatus;
  user: User;
  created_at: Date;
  updated_at: Date;
}
