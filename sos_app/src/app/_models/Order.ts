import { Equipment } from "./Equipment";
import { OrderStatus } from "./OrderStatus";
import { User } from "./User";

export interface Order {
    id: string;
    title: string;
    user_id: string;
    equipment_id: string;
    equipment: Equipment;
    total_price: number;
    parts_price: number;
    technician_id: number;
    service_price: number;
    description: string;
    status: OrderStatus;
    user: User;
    created_at: Date;
    updated_at: Date;
}