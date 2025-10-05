import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";


export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}


export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Duplicate value", meta: err.meta });
    }
  }
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}
