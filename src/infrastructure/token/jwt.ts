import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { UserPermission } from "@/domain/model/user";
import { PermissionManager } from "@/domain/gateway";

const errInvalidToken = "invalid token";

// UserClaims includes user info.
interface UserClaims {
  userID: number;
  userName: string;
  permission: UserPermission;
  [key: string]: any;
}

// Keeper manages user tokens.
export class TokenKeeper implements PermissionManager {
  private secretKey: Buffer;
  private expireHours: number;

  constructor(secretKey: string, expireInHours: number) {
    this.secretKey = Buffer.from(secretKey);
    this.expireHours = expireInHours;
  }

  // GenerateToken generates a new JWT token.
  generateToken(userID: number, email: string, perm: UserPermission): string {
    const expirationTime =
      Math.floor(Date.now() / 1000) + this.expireHours * 3600;
    const payload: UserClaims = {
      userID,
      userName: email,
      permission: perm,
      exp: expirationTime,
    };

    const options: SignOptions = {
      algorithm: "HS256",
    };

    return jwt.sign(payload, this.secretKey, options);
  }

  // ExtractToken extracts the token from the signed string.
  extractToken(tokenResult: string): UserClaims {
    const options: VerifyOptions = {
      algorithms: ["HS256"],
    };

    try {
      const decoded = jwt.verify(
        tokenResult,
        this.secretKey,
        options
      ) as UserClaims;
      return decoded;
    } catch (error) {
      throw new Error(errInvalidToken);
    }
  }

  // HasPermission checks if user has the given permission.
  hasPermission(tokenResult: string, perm: UserPermission): boolean {
    const claims = this.extractToken(tokenResult);
    return claims.permission >= perm;
  }
}
