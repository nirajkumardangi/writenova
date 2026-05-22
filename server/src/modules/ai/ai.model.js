import mongoose from "mongoose";

const aiArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    },
    excerpt: {
      type: String,
      maxLength: 140,
    },
    topics: {
      type: [String],
      default: [],
    },
    generationMeta: {
      tone: { type: String },
      length: { type: String },
      category: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

const AiArticle = mongoose.model("AiArticle", aiArticleSchema);

export default AiArticle;
