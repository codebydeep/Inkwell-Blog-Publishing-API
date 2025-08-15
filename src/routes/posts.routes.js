import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPost, deletePost, editPost, getPosts, viewPublishPost } from "../controllers/posts.controllers.js";
import { checkAuthor } from "../middlewares/posts.middleware.js";

const postsRoutes = Router();

postsRoutes.post("/", authMiddleware, createPost);
postsRoutes.get("/", authMiddleware, getPosts);
postsRoutes.get("/:id", authMiddleware, viewPublishPost);
postsRoutes.put("/:id", authMiddleware, checkAuthor, editPost);
postsRoutes.delete("/:id", authMiddleware, checkAuthor, deletePost);

export default postsRoutes;