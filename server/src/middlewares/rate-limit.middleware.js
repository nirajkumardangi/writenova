import rateLimit from "express-rate-limit";

// 5 requests per minute for OTP requests
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many OTP requests",
});

// 10 requests per minute for AI endpoints
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many AI requests",
});