import express from "express";

import {
  sendOTP,
  verifyOTP,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { otpLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/send-otp", otpLimiter, sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
