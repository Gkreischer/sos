import { UserInterface } from 'shared';

export interface ActivityInterface {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  subject: UserInterface;
  event: string;
  causer: UserInterface;
  causer_type: string;
  causer_id: number;
  attribute_changes: {
    attributes: Object;
    old: Object;
  };
  properties: {
    ip: string;
    user_agent: string;
    hostname: string;
  };
  created_at: Date;
  updated_at: Date;
}
