import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPost, getPosts } from "../controllers/posts.controllers.js";

const postsRoutes = Router();

postsRoutes.post("/", authMiddleware, createPost);
postsRoutes.get("/", authMiddleware, getPosts);
postsRoutes.get("/:id", authMiddleware, getPosts);

export default postsRoutes;