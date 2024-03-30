export interface Order {
    id: string;
    title: string;
    user_id: string;
    equipment_id: string;
    total_price: number;
    parts_price: number;
    technician_id: number;
    service_price: number;
    description: string;
    status: number;
    created_at: Date;
    updated_at: Date;
}