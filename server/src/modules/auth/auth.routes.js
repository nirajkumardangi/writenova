import express from "express";

import {
  sendOTP,
  verifyOTP,
  refreshToken,
  logout,
  googleLogin,
} from "./auth.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

import { otpLimiter } from "../../middlewares/rate-limit.middleware.js";

const router = express.Router();

router.post("/send-otp", otpLimiter, sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google", googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
