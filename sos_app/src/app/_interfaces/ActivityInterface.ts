export interface ActivityInterface {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  event: string;
  causer_type: string;
  causer_id: number;
  attribute_changes: string;
  properties: string;
  created_at: Date;
  updated_at: Date;
}
