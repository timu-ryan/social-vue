import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env, isProd } from "./env";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import postsRoutes from "./routes/posts.routes";
import { notFound, errorHandler } from "./middleware/error";


const app = express();


app.use(helmet());
app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);


app.use(notFound);
app.use(errorHandler);


export default app;
