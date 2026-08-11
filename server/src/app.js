import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import apiRouter from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Security headers
app.use(helmet());

// CORS — use env variable with localhost fallback
const ALLOWED_ORIGINS = (process.env.CLIENT_URL || "http://localhost:3000").split(",").map(s => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, mobile, curl)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Body parsing with size limit to prevent DoS
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

// Global API rate limiter — 200 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use("/api", globalLimiter);

app.use("/api", apiRouter);

app.use(globalErrorHandler);

export default app;
