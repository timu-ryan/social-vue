import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { hashPassword, verifyPassword } from "../utils/password";
import { newJti, setRefreshCookie, clearRefreshCookie, signAccessToken, signRefreshToken, verifyRefresh } from "../utils/jwt";
import { validate } from "../middleware/validate";
import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../env";
import { Prisma } from "@prisma/client";

const router = Router();


const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});


// Регистрация
const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(8),
  }),
});


router.post("/register", authLimiter, validate(registerSchema), async (req: Request, res: Response) => {
  const { email, username, password } = req.body as any;


  const passwordHash = await hashPassword(password);
  let user;
  try {
    user = await prisma.user.create({ data: { email, username, passwordHash } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const metaTarget = error.meta?.target as string[] | string | undefined;
      const firstTarget = Array.isArray(metaTarget) ? metaTarget[0] : metaTarget;
      const conflictField = firstTarget === "email" ? "email" : firstTarget === "username" ? "username" : "account";
      return res.status(409).json({ error: `${conflictField} already in use` });
    }
    throw error;
  }


  const jti = newJti();
  const refresh = signRefreshToken(user.id, jti);
  const access = signAccessToken(user.id);


  await prisma.refreshToken.create({
    data: {
      id: jti,
      userId: user.id,
      userAgent: req.get("user-agent") || undefined,
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.REFRESH_TOKEN_TTL_DAYS),
    },
  });


  setRefreshCookie(res, refresh);
  res.status(201).json({ accessToken: access, user: { id: user.id, email: user.email, username: user.username } });
});

// Логин (email или username)
const loginSchema = z.object({
  body: z.object({
    login: z.string(), // email или username
    password: z.string().min(8),
  }),
});


router.post("/login", authLimiter, validate(loginSchema), async (req: Request, res: Response) => {
  const { login, password } = req.body as any;


  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: login }, { username: login }],
    },
  });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });


  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });


  const jti = newJti();
  const refresh = signRefreshToken(user.id, jti);
  const access = signAccessToken(user.id);


  await prisma.refreshToken.create({
    data: {
      id: jti,
      userId: user.id,
      userAgent: req.get("user-agent") || undefined,
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.REFRESH_TOKEN_TTL_DAYS),
    },
  });


  setRefreshCookie(res, refresh);
  res.json({ accessToken: access, user: { id: user.id, email: user.email, username: user.username } });
});


// Обновление access по refresh (ротация)
router.post("/refresh", authLimiter, async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) return res.status(401).json({ error: "No refresh token" });


  try {
    const payload = verifyRefresh(token);


    const stored = await prisma.refreshToken.findUnique({ where: { id: payload.jti } });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }


    // Ротация
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });


    const newJ = newJti();
    const newRefresh = signRefreshToken(payload.sub, newJ);
    await prisma.refreshToken.create({
      data: {
        id: newJ,
        userId: payload.sub,
        userAgent: req.get("user-agent") || undefined,
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * env.REFRESH_TOKEN_TTL_DAYS),
      },
    });


    const newAccess = signAccessToken(payload.sub);
    setRefreshCookie(res, newRefresh);
    return res.json({ accessToken: newAccess });
  } catch (e) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});


// Logout — отзываем refresh
router.post("/logout", authLimiter, async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  clearRefreshCookie(res);
  if (!token) return res.status(204).send();


  try {
    const payload = verifyRefresh(token);
    await prisma.refreshToken.update({ where: { id: payload.jti }, data: { revoked: true } });
  } catch (_) {}


  return res.status(204).send();
});


// Текущий пользователь (по access)
router.get("/me", async (req: Request, res: Response) => {
  const auth = req.header("authorization");
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing Authorization header" });
  const token = auth.split(" ")[1];
  try {
    const { sub } = verifyRefresh(token as any); // ОШИБКА: доступ нужно проверять access, не refresh
    // Исправляем:
  } catch {}
  // Правильный вариант ниже (оставляем рабочий):
  try {
    const jwt = req.header("authorization")!.split(" ")[1];
    const { sub } = (await import("../utils/jwt")).verifyAccess(jwt);
    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: { id: true, email: true, username: true, displayName: true, bio: true, avatarUrl: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
});


export default router;
