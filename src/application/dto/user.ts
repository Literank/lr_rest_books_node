// UserCredential represents the user's sign-in email and password
export interface UserCredential {
  email: string;
  password: string;
}

// User is used as result of a successful sign-in
export interface User {
  id: number;
  email: string;
}

export interface UserToken {
  user: User;
  token: string;
}
