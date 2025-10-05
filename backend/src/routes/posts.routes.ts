import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";


const router = Router();


// Создание поста
const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(2000),
    imageUrl: z.string().url().optional(),
  }),
});


router.post("/", requireAuth, validate(createPostSchema), async (req, res) => {
  const userId = req.user!.id;
  const { title, description, imageUrl } = req.body as any;
  const post = await prisma.post.create({
    data: { title, description, imageUrl, authorId: userId },
    include: { author: { select: { id: true, username: true, displayName: true, avatarUrl: true } }, _count: { select: { likes: true } } },
  });
  res.status(201).json({ post: { ...post, likesCount: (post as any)._count.likes } });
});

// Лента постов (все видят)
router.get("/", async (req, res) => {
  const auth = req.header("authorization");
  let currentUserId: string | undefined;
  if (auth?.startsWith("Bearer ")) {
    try {
      const { verifyAccess } = await import("../utils/jwt");
      const { sub } = verifyAccess(auth.split(" ")[1]);
      currentUserId = sub;
    } catch {}
  }


  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true } },
      likes: currentUserId ? { where: { userId: currentUserId }, select: { userId: true } } : false,
    },
  });


  const mapped = posts.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt,
    author: p.author,
    likesCount: (p as any)._count.likes,
    likedByMe: currentUserId ? (p as any).likes.length > 0 : false,
  }));


  res.json({ posts: mapped });
});

// Лайк
router.post("/:id/likes", requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const postId = req.params.id;


  try {
    await prisma.postLike.create({ data: { postId, userId } });
    return res.status(201).json({ liked: true });
  } catch (e: any) {
// если уже лайкали (primary key конфликт) — делаем идемпотентно
    return res.status(200).json({ liked: true });
  }
});


// Убрать лайк
router.delete("/:id/likes", requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const postId = req.params.id;
  await prisma.postLike.deleteMany({ where: { postId, userId } });
  return res.status(200).json({ liked: false });
});


export default router;
