import express from "express";
import { getProfile } from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

export default router;
