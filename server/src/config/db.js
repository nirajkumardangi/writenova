import mongoose from "mongoose";
import env from "./env.js";
import AiArticle from "../modules/ai/ai.model.js";

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

async function migrateArticleSlugs() {
  try {
    const unsluggedArticles = await AiArticle.find({
      $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
    });

    if (unsluggedArticles.length > 0) {
      console.log(`Generating URL slugs for ${unsluggedArticles.length} existing articles...`);
      for (const article of unsluggedArticles) {
        const baseSlug = slugify(article.title || "untitled");
        let generatedSlug = baseSlug;
        let count = 0;
        while (
          await AiArticle.findOne({
            slug: generatedSlug,
            _id: { $ne: article._id },
          })
        ) {
          count++;
          generatedSlug = `${baseSlug}-${count}`;
        }
        article.slug = generatedSlug;
        await article.save();
      }
      console.log("Article slug migration complete ✅");
    }
  } catch (error) {
    console.error("Slug migration error:", error.message);
  }
}

async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: "WriteNova",
    });
    console.log("MongoDB connected ✅");
    await migrateArticleSlugs();
  } catch (error) {
    console.log("MongoDB Connection Failed ❌", error);
    process.exit(1);
  }
}

export default connectDB;
