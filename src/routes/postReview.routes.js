import { Router } from "express";

import { approvePost, getPendingPosts, rejectPost } from "../controllers/postReview.controllers.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";

const postReviewRoutes = Router();

postReviewRoutes.get("/", authMiddleware, checkAdmin, getPendingPosts);
postReviewRoutes.put("/:id/approve", authMiddleware, checkAdmin, approvePost);
postReviewRoutes.put("/:id/reject", authMiddleware, checkAdmin, rejectPost);

export default postReviewRoutes;