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
      required: true,
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
