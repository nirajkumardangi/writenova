import { getUserById } from "./user.service.js";

export async function getProfile(req, res, next) {
  try {
    const user = await getUserById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}
