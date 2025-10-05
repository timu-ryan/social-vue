import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";


export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization");
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing Authorization header" });


  const token = auth.split(" ")[1];
  try {
    const payload = verifyAccess(token);
    req.user = { id: payload.sub };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
}
