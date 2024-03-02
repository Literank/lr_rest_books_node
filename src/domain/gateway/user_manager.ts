import { User } from "@/domain/model";

export interface UserManager {
  createUser(u: User): Promise<number>;
  getUserByEmail(email: string): Promise<User | null>;
}
