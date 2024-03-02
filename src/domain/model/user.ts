// UserPermission represents different levels of user permissions.
export enum UserPermission {
  PermNone = 0,
  PermUser = 1,
  PermAuthor = 2,
  PermAdmin = 3,
}

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
