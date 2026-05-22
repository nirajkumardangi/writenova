import { getUserById } from "./user.service.js";
import User from "./user.model.js";
import AiArticle from "../ai/ai.model.js";

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

export async function getPublicProfile(req, res, next) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const articles = await AiArticle.find({ author: user._id, status: "published" }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      articles,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendedUsers(req, res, next) {
  try {
    const currentUserId = req.user?._id;
    const users = await User.find(currentUserId ? { _id: { $ne: currentUserId } } : {})
      .limit(5);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
}

