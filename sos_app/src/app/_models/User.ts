import { Equipment } from './Equipment';
import { UserType } from './UserType';

export interface User {
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
  equipments: Array<Equipment>;
  corporate_name: string;
  created_at: Date;
  updated_at: Date;
}
