import { Request, Response, NextFunction } from "express";
import { UserPermission } from "@/domain/model";
import { PermissionManager } from "@/domain/gateway";

const tokenPrefix = "Bearer ";

// permCheck middleware checks user permission
export function permCheck(
  permManager: PermissionManager,
  allowPerm: UserPermission
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith(tokenPrefix)) {
      return res.status(401).json({ error: "token is required" });
    }

    const token = authHeader.replace(tokenPrefix, "");

    try {
      if (!permManager.hasPermission(token, allowPerm)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  };
}
