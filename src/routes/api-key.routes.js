import { Router } from "express";
import { generateApiKey } from "../controllers/apiKey.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import limiter from "../utils/rate-limiter.js";

const ApiKeyRoutes = Router();

ApiKeyRoutes.use(limiter);

ApiKeyRoutes.get("/get-api-key", authMiddleware, generateApiKey);

export default ApiKeyRoutes;