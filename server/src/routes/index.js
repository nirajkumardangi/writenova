import express from "express";
import aiRoutes from "../modules/ai/ai.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import editorRoutes from "../modules/editor/editor.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import socialRoutes from "../modules/social/social.routes.js";
import notificationRoutes from "../modules/notifications/notification.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/ai", aiRoutes);
router.use("/editor", editorRoutes);
router.use("/social", socialRoutes);
router.use("/notifications", notificationRoutes);

export default router;
