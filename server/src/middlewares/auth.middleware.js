import jwt from "jsonwebtoken";
import User from "../modules/users/user.model.js";
import env from "../config/env.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — no token provided",
      });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    } catch (jwtError) {
      // Token expired or invalid — return 401 so the client can refresh
      return res.status(401).json({
        success: false,
        message:
          jwtError.name === "TokenExpiredError"
            ? "Token expired"
            : "Invalid token",
      });
    }

    // check if user exists
    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — user not found",
      });
    }

    // attach user to request
    req.user = user;

    // call next middleware
    next();
  } catch (error) {
    next(error);
  }
}
