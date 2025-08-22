import { Router } from "express";

import { changeCurrentPassword, getMe, login, logout, refreshAccessToken, register, verifyEmail } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { keyMiddleware } from "../middlewares/apiKey.middleware.js";

const authRoutes = Router();

// authRoutes.use(keyMiddleware);

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/logout", authMiddleware, logout);

authRoutes.get("/get-user", authMiddleware, getMe);

authRoutes.post("/refresh-token", refreshAccessToken);
authRoutes.post("/change-password", authMiddleware, changeCurrentPassword);

authRoutes.get("/verify-email/", verifyEmail);

export default authRoutes;