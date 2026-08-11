import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  toggleLike,
  getLikeStatus,
  getArticleLikeCount,
  createComment,
  getComments,
  deleteComment,
  toggleBookmark,
  getBookmarkStatus,
  getMyBookmarks,
  toggleFollow,
  getFollowStatus,
  getMyFollowers,
  getMyFollowing,
  getBatchSocialStatus,
} from "./social.controller.js";

const router = express.Router();

// ── Public routes (no auth needed) ──
router.get("/likes/count/:articleId", getArticleLikeCount);
router.get("/comments/:articleId", getComments);

// ── Protected routes ──
router.use(protect);

// Batch status (for feed performance)
router.post("/batch-status", getBatchSocialStatus);

// Likes
router.post("/like/:articleId", toggleLike);
router.get("/like/:articleId", getLikeStatus);

// Comments
router.post("/comment/:articleId", createComment);
router.delete("/comment/:commentId", deleteComment);

// Bookmarks
router.post("/bookmark/:articleId", toggleBookmark);
router.get("/bookmark/:articleId", getBookmarkStatus);
router.get("/bookmarks", getMyBookmarks);

// Follow
router.post("/follow/:userId", toggleFollow);
router.get("/follow/:userId", getFollowStatus);
router.get("/followers", getMyFollowers);
router.get("/following", getMyFollowing);

export default router;
