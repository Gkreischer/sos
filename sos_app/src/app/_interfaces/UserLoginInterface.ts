import { UserInterface } from './UserInterface';

export interface UserLoginInterface {
  id: number;
  email: string;
  password: string;
  token?: string;
  user?: UserInterface;
  role?: string;
}
