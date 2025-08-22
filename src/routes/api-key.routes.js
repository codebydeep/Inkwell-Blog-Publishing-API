import { Router } from "express";
import { generateApiKey } from "../controllers/apiKey.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const ApiKeyRoutes = Router();

ApiKeyRoutes.get("/get-api-key", authMiddleware, generateApiKey);

export default ApiKeyRoutes;