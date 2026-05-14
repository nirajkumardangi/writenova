import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import env from "../config/env.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    // check if user exists
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // attach user to request
    req.user = user;

    // call next middleware
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
