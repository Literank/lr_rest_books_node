import { User, UserPermission } from "@/domain/model";

export interface UserManager {
  createUser(u: User): Promise<number>;
  getUserByEmail(email: string): Promise<User | null>;
}

export interface PermissionManager {
  generateToken(userID: number, email: string, perm: UserPermission): string;
  hasPermission(token: string, perm: UserPermission): boolean;
}
