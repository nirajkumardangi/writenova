import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
} from "./notification.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
