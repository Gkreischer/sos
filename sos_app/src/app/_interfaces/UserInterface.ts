import { EquipmentInterface } from './EquipmentInterface';
import { UserTypeInterface } from './UserTypeInterface';

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  address: string;
  cep: string;
  city: string;
  state: string;
  cnpj: string;
  country: string;
  cpf: string;
  image: string;
  fantasy_name: string;
  phone: string;
  equipments: Array<EquipmentInterface>;
  type_id: number;
  type: UserTypeInterface;
  corporate_name: string;
  password: string;
  token?: string;
  password_confirmation?: string;
  created_at: Date;
  updated_at: Date;
}
