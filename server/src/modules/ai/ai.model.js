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
    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
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

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

aiArticleSchema.pre("save", async function () {
  if (!this.slug || this.isModified("title")) {
    const baseSlug = slugify(this.title || "untitled");
    let generatedSlug = baseSlug;
    let count = 0;
    const ArticleModel = this.constructor;
    while (await ArticleModel.findOne({ slug: generatedSlug, _id: { $ne: this._id } })) {
      count++;
      generatedSlug = `${baseSlug}-${count}`;
    }
    this.slug = generatedSlug;
  }
});

const AiArticle = mongoose.model("AiArticle", aiArticleSchema);

export default AiArticle;
