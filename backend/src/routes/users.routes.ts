import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";


const router = Router();


const updateMeSchema = z.object({
  body: z.object({
    displayName: z.string().min(1).max(64).optional(),
    bio: z.string().max(280).optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

const listUsersSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  }),
});

const profileSchema = z.object({
  params: z.object({
    username: z
      .string()
      .min(3)
      .max(32)
      .regex(/^[a-zA-Z0-9_]+$/),
  }),
});


router.patch("/me", requireAuth, validate(updateMeSchema), async (req, res) => {
  const userId = req.user!.id;
  const { displayName, bio, avatarUrl } = req.body as any;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { displayName, bio, avatarUrl },
    select: { id: true, email: true, username: true, displayName: true, bio: true, avatarUrl: true, createdAt: true },
  });
  res.json({ user });
});


router.get("/", requireAuth, validate(listUsersSchema), async (req, res) => {
  const { limit = 20, offset = 0 } = req.query as unknown as { limit?: number; offset?: number };

  const users = await prisma.user.findMany({
    skip: offset,
    take: limit + 1,
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, username: true, displayName: true, bio: true, avatarUrl: true, createdAt: true },
  });

  const hasMore = users.length > limit;
  if (hasMore) users.pop();

  res.json({
    users,
    meta: {
      limit,
      offset,
      nextOffset: hasMore ? offset + limit : null,
      hasMore,
    },
  });
});


router.get("/:username", requireAuth, validate(profileSchema), async (req, res) => {
  const { username } = req.params as { username: string };

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, email: true, username: true, displayName: true, bio: true, avatarUrl: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ user });
});


export default router;
