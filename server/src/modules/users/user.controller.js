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

export async function updateProfile(req, res, next) {
  try {
    const userId = req.user._id;
    const { username, bio, avatar, coverImage, socialLinks } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (username !== undefined) {
      // Check if username taken by another user
      const existing = await User.findOne({ username: username.trim(), _id: { $ne: userId } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Username is already taken" });
      }
      user.username = username.trim();
    }

    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (coverImage !== undefined) user.coverImage = coverImage;
    if (socialLinks !== undefined) user.socialLinks = { ...user.socialLinks, ...socialLinks };

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
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
