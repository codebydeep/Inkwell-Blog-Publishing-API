import { Router } from "express";
import { addCategory, getCategories } from "../controllers/category.controllers.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";

const categoryRoutes = Router();

categoryRoutes.post("/", authMiddleware, checkAdmin, addCategory);
categoryRoutes.get("/", authMiddleware, getCategories);

export default categoryRoutes;