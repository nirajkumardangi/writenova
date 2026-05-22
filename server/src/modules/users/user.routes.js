import express from "express";
import { getProfile, getPublicProfile, getRecommendedUsers } from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/recommended", protect, getRecommendedUsers);
router.get("/public/:username", getPublicProfile);

export default router;
