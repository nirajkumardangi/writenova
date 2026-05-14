import jwt from "jsonwebtoken";
import env from "../config/env.js";

export function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}
