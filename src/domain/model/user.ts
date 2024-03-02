// User represents an app user
export interface User {
  id?: number;
  email: string;
  password: string;
  salt: string;
  is_admin: boolean;
  created_at?: Date;
  updated_at?: Date;
}
