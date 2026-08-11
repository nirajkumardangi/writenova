import mongoose from "mongoose";
import { Like, Comment, Bookmark, Follow } from "./social.model.js";
import AiArticle from "../ai/ai.model.js";
import Notification from "../notifications/notification.model.js";

// ────────── LIKES ──────────

export async function toggleLike(req, res, next) {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;

    const existing = await Like.findOne({ user: userId, article: articleId });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      const likeCount = await Like.countDocuments({ article: articleId });
      return res.json({ success: true, liked: false, likeCount });
    }

    await Like.create({ user: userId, article: articleId });
    const likeCount = await Like.countDocuments({ article: articleId });

    // Trigger notification for author
    const articleDoc = await AiArticle.findById(articleId).select("author title");
    if (articleDoc && articleDoc.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: articleDoc.author,
        sender: userId,
        type: "like",
        article: articleId,
        message: `liked your story "${articleDoc.title}"`,
      });
    }

    res.json({ success: true, liked: true, likeCount });
  } catch (error) {
    next(error);
  }
}

export async function getLikeStatus(req, res, next) {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;

    const liked = !!(await Like.findOne({ user: userId, article: articleId }));
    const likeCount = await Like.countDocuments({ article: articleId });

    res.json({ success: true, liked, likeCount });
  } catch (error) {
    next(error);
  }
}

export async function getArticleLikeCount(req, res, next) {
  try {
    const { articleId } = req.params;
    const likeCount = await Like.countDocuments({ article: articleId });
    res.json({ success: true, likeCount });
  } catch (error) {
    next(error);
  }
}

// ────────── COMMENTS ──────────

export async function createComment(req, res, next) {
  try {
    const { articleId } = req.params;
    const { content, parentComment } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }

    const comment = await Comment.create({
      user: userId,
      article: articleId,
      content: content.trim(),
      parentComment: parentComment || null,
    });

    const populated = await Comment.findById(comment._id).populate("user", "username avatar");

    // Trigger notification for author
    const articleDoc = await AiArticle.findById(articleId).select("author title");
    if (articleDoc && articleDoc.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: articleDoc.author,
        sender: userId,
        type: "comment",
        article: articleId,
        message: `responded to your story "${articleDoc.title}"`,
      });
    }

    res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    next(error);
  }
}

export async function getComments(req, res, next) {
  try {
    const { articleId } = req.params;

    const comments = await Comment.find({ article: articleId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    const commentCount = comments.length;

    res.json({ success: true, comments, commentCount });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findOne({ _id: commentId, user: userId });

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found or unauthorized" });
    }

    // Also delete replies to this comment
    await Comment.deleteMany({ parentComment: commentId });
    await Comment.deleteOne({ _id: commentId });

    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
}

// ────────── BOOKMARKS ──────────

export async function toggleBookmark(req, res, next) {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;

    const existing = await Bookmark.findOne({ user: userId, article: articleId });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.json({ success: true, bookmarked: false });
    }

    await Bookmark.create({ user: userId, article: articleId });
    res.json({ success: true, bookmarked: true });
  } catch (error) {
    next(error);
  }
}

export async function getBookmarkStatus(req, res, next) {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;

    const bookmarked = !!(await Bookmark.findOne({ user: userId, article: articleId }));
    res.json({ success: true, bookmarked });
  } catch (error) {
    next(error);
  }
}

export async function getMyBookmarks(req, res, next) {
  try {
    const userId = req.user._id;

    const bookmarks = await Bookmark.find({ user: userId })
      .populate({
        path: "article",
        populate: { path: "author", select: "username avatar" },
      })
      .sort({ createdAt: -1 });

    const articles = bookmarks
      .filter((b) => b.article)
      .map((b) => b.article);

    res.json({ success: true, articles });
  } catch (error) {
    next(error);
  }
}

// ────────── FOLLOW ──────────

export async function toggleFollow(req, res, next) {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ success: false, message: "Cannot follow yourself" });
    }

    const existing = await Follow.findOne({ follower: currentUserId, following: targetUserId });

    if (existing) {
      await Follow.deleteOne({ _id: existing._id });
      const followerCount = await Follow.countDocuments({ following: targetUserId });
      return res.json({ success: true, following: false, followerCount });
    }

    await Follow.create({ follower: currentUserId, following: targetUserId });
    const followerCount = await Follow.countDocuments({ following: targetUserId });

    // Trigger notification for followed user
    await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: "follow",
      message: `started following you`,
    });

    res.json({ success: true, following: true, followerCount });
  } catch (error) {
    next(error);
  }
}

export async function getFollowStatus(req, res, next) {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user._id;

    const isFollowing = !!(await Follow.findOne({ follower: currentUserId, following: targetUserId }));
    const followerCount = await Follow.countDocuments({ following: targetUserId });
    const followingCount = await Follow.countDocuments({ follower: targetUserId });

    res.json({ success: true, isFollowing, followerCount, followingCount });
  } catch (error) {
    next(error);
  }
}

export async function getMyFollowers(req, res, next) {
  try {
    const userId = req.user._id;

    const followers = await Follow.find({ following: userId })
      .populate("follower", "username avatar bio")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      followers: followers.map((f) => f.follower),
      followerCount: followers.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyFollowing(req, res, next) {
  try {
    const userId = req.user._id;

    const following = await Follow.find({ follower: userId })
      .populate("following", "username avatar bio")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      following: following.map((f) => f.following),
      followingCount: following.length,
    });
  } catch (error) {
    next(error);
  }
}

// ────────── BATCH STATUS (for Feed) ──────────

export async function getBatchSocialStatus(req, res, next) {
  try {
    const { articleIds } = req.body;
    const userId = req.user._id;

    if (!articleIds || !Array.isArray(articleIds)) {
      return res.status(400).json({ success: false, message: "articleIds array required" });
    }

    // Get all likes, bookmarks, and counts in parallel
    const [userLikes, userBookmarks, likeCounts, commentCounts] = await Promise.all([
      Like.find({ user: userId, article: { $in: articleIds } }).select("article"),
      Bookmark.find({ user: userId, article: { $in: articleIds } }).select("article"),
      Like.aggregate([
        { $match: { article: { $in: articleIds.map((id) => new mongoose.Types.ObjectId(id)) } } },
        { $group: { _id: "$article", count: { $sum: 1 } } },
      ]),
      Comment.aggregate([
        { $match: { article: { $in: articleIds.map((id) => new mongoose.Types.ObjectId(id)) } } },
        { $group: { _id: "$article", count: { $sum: 1 } } },
      ]),
    ]);

    const likedSet = new Set(userLikes.map((l) => l.article.toString()));
    const bookmarkedSet = new Set(userBookmarks.map((b) => b.article.toString()));
    const likeCountMap = Object.fromEntries(likeCounts.map((l) => [l._id.toString(), l.count]));
    const commentCountMap = Object.fromEntries(commentCounts.map((c) => [c._id.toString(), c.count]));

    const statuses = {};
    for (const id of articleIds) {
      statuses[id] = {
        liked: likedSet.has(id),
        bookmarked: bookmarkedSet.has(id),
        likeCount: likeCountMap[id] || 0,
        commentCount: commentCountMap[id] || 0,
      };
    }

    res.json({ success: true, statuses });
  } catch (error) {
    next(error);
  }
}
