import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthCheckRoutes from "./routes/healthcheck.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ 
    extended: true 
}));

app.use(cookieParser());

app.use("/api/v1", healthCheckRoutes);

export default app;
