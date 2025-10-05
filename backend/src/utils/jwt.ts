import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env, isProd, ACCESS_TTL_SEC, REFRESH_TTL_SEC } from "../env";
import type { Response } from "express";

export function signAccessToken(userId: string) {
  const payload = { sub: userId };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL_SEC });
}

export function signRefreshToken(userId: string, jti: string) {
  const payload = { sub: userId, jti };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL_SEC });
}

export function verifyAccess(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
}

export function verifyRefresh(token: string): { sub: string; jti: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as any;
}

export function newJti() {
  return uuidv4();
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 1000 * 60 * 60 * 24 * env.REFRESH_TOKEN_TTL_DAYS,
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie("refreshToken", { path: "/api/auth" });
}
