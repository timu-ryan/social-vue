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


export default router;
