import { createHash } from "crypto";

import { UserManager } from "@/domain/gateway";
import { UserCredential, User } from "@/application/dto";

const saltLen = 4;
const errEmptyEmail = "empty email";
const errEmptyPassword = "empty password";
const errDoesNotExist = "user does not exist";

export class UserOperator {
  private userManager: UserManager;

  constructor(u: UserManager) {
    this.userManager = u;
  }

  async createUser(uc: UserCredential): Promise<User | null> {
    if (!uc.email) {
      throw new Error(errEmptyEmail);
    }
    if (!uc.password) {
      throw new Error(errEmptyPassword);
    }
    const salt = randomString(saltLen);
    const user = {
      email: uc.email,
      password: sha1Hash(uc.password + salt),
      salt,
      is_admin: false,
    };
    const id = await this.userManager.createUser(user);
    return { id, email: uc.email };
  }

  async signIn(email: string, password: string): Promise<User | null> {
    if (!email) {
      throw new Error(errEmptyEmail);
    }
    if (!password) {
      throw new Error(errEmptyPassword);
    }
    const user = await this.userManager.getUserByEmail(email);
    if (!user) {
      throw new Error(errDoesNotExist);
    }
    const passwordHash = sha1Hash(password + user.salt);
    if (user.password !== passwordHash) {
      throw new Error("wrong password");
    }
    return { id: user.id!, email: user.email };
  }
}

function randomString(length: number): string {
  const charset: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result: string = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

function sha1Hash(input: string): string {
  return createHash("sha1").update(input).digest("hex");
}
