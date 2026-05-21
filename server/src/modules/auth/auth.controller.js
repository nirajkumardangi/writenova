import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";
import env from "../../config/env.js";
import { redis } from "../../config/redis.js";

import User from "../users/user.model.js";

import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { generateOTP } from "../../utils/otp.js";
import sendMail from "../../utils/sendMail.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* 
=============================
SEND OTP
=============================
*/

export async function sendOTP(req, res, next) {
  try {
    // check email
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email required",
      });
    }

    // prevent spam
    const cooldown = await redis.get(`otp_cooldown:${email}`);

    if (cooldown) {
      return res.status(429).json({
        message: "Please wait before requesting another OTP",
      });
    }

    // generate otp
    const otp = generateOTP();

    // hash otp
    const hashedOTP = await bcrypt.hash(otp, 10);

    // save in radis for 5 mins
    await redis.set(`otp:${email}`, hashedOTP, { EX: 300 });

    // cooldown 1 minute
    await redis.set(`otp_cooldown:${email}`, "true", {
      EX: 60,
    });

    // send email
    await sendMail(email, otp);

    res.status(200).json({
      status: true,
      message: "OTP send successfully",
    });
  } catch (error) {
    next(error);
  }
}

/* 
=============================
VERIFY OTP
=============================
*/

export async function verifyOTP(req, res, next) {
  try {
    // verify email and otp
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP required",
      });
    }

    // check redis
    const storedOTP = await redis.get(`otp:${email}`);

    if (!storedOTP) {
      return res.status(404).json({
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, storedOTP);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // delete otp from redis after verification
    await redis.del(`otp:${email}`);

    // login or create user
    let user = await User.findOne({ email });

    // create user if not exists
    if (!user) {
      const baseUsername = email.split("@")[0];

      const username = baseUsername + Math.floor(Math.random() * 1000);

      user = await User.create({
        email,
        username,
      });
    }

    // generate token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await redis.set(`refresh_token:${user._id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    // secure cookie
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);

    // send token to client
    res.status(200).json({
      status: true,
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

/* 
=============================
REFRESH TOKEN
=============================
*/

export async function refreshToken(req, res, next) {
  try {
    // get refresh token from cookie
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    // verify refresh token
    const decodedToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

    // check redis
    const storedRefreshToken = await redis.get(
      `refresh_token:${decodedToken.id}`,
    );

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Refresh token expired or invalid",
      });
    }

    // generate new token
    const newAccessToken = generateAccessToken(decodedToken.id);

    res.status(200).json({
      status: true,
      message: "Token refreshed successfully",
      newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}

/* 
=============================
LOGIN WITH GOOGLE
=============================
*/

export const googleLogin = async (req, res, next) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Google authorization code required",
      });
    }

    const oAuth2Client = new OAuth2Client(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      redirectUri,
    );

    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      return res.status(400).json({
        message: "Failed to retrieve Google ID Token",
      });
    }

    // verify token
    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    // user info from google
    const payload = ticket.getPayload();

    const { email, name, picture, email_verified } = payload;

    // security check
    if (!email_verified) {
      return res.status(400).json({
        message: "Google email not verified",
      });
    }

    // check existing user
    let user = await User.findOne({ email });

    // create user
    if (!user) {
      const username = email.split("@")[0];

      user = await User.create({
        email,
        username,
        avatar: picture,
      });
    }

    // generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // save refresh token
    await redis.set(`refresh_token:${user._id}`, refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    // secure cookie
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/* 
=============================
LOGOUT
=============================
*/

export async function logout(req, res, next) {
  try {
    // get refresh token from cookie
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      try {
        // verify refresh token to find user id
        const decodedToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

        // delete refresh token from redis
        await redis.del(`refresh_token:${decodedToken.id}`);
      } catch (err) {
        // Ignore verify or redis errors during logout
      }
    }

    // clear refresh token cookie unconditionally
    res.clearCookie("refresh_token", refreshCookieOptions);

    res.status(200).json({
      status: true,
      message: "Logout successful",
    });
  } catch (error) {
    // Fallback: clear cookie and return 200 even if something else goes wrong
    res.clearCookie("refresh_token", refreshCookieOptions);
    next(error);
  }
}
