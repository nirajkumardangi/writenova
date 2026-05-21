import express from "express";

import {
  sendOTP,
  verifyOTP,
  refreshToken,
  logout,
  googleLogin,
  getUser,
} from "./auth.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { otpLimiter } from "../../middlewares/rate-limit.middleware.js";

const router = express.Router();

router.post("/send-otp", otpLimiter, sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google", googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);

router.get("/me", protect, getUser);

export default router;
