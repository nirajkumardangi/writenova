import mongoose from "mongoose";

// ── Like Model ──
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiArticle",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
// Prevent duplicate likes
likeSchema.index({ user: 1, article: 1 }, { unique: true });
export const Like = mongoose.model("Like", likeSchema);

// ── Comment Model ──
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiArticle",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 2000,
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);
commentSchema.index({ article: 1, createdAt: -1 });
export const Comment = mongoose.model("Comment", commentSchema);

// ── Bookmark Model ──
const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiArticle",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
// Prevent duplicate bookmarks
bookmarkSchema.index({ user: 1, article: 1 }, { unique: true });
export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

// ── Follow Model ──
const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
// Prevent duplicate follows and self-follow at app level
followSchema.index({ follower: 1, following: 1 }, { unique: true });
export const Follow = mongoose.model("Follow", followSchema);
