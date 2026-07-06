import { UserInterface } from './UserInterface';
import { UserTypeInterface } from './UserTypeInterface';

export interface UserLoginInterface {
  id: number;
  email: string;
  password: string;
  token?: string;
  type: UserTypeInterface;
  user?: UserInterface;
}
