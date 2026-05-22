import express from "express";
import aiRoutes from "../modules/ai/ai.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/ai", aiRoutes);

export default router;
