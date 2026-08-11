import mongoose from "mongoose";
import AiArticle from "../ai/ai.model.js";
import User from "../users/user.model.js";
import { sanitizeHtml } from "../../utils/sanitize.js";

/**
 * @description Get single article by ID
 * @route GET /api/editor/:postId
 * @access Private
 */
export async function getArticle(req, res, next) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const article = await AiArticle.findOne({ _id: postId, author: userId });
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @description Update/autosave an article
 * @route PUT /api/editor/:postId
 * @access Private
 */
export async function updateArticle(req, res, next) {
  try {
    const { postId } = req.params;
    const { content, title, status, coverImage, excerpt, topics } = req.body;
    const userId = req.user._id;

    const article = await AiArticle.findOne({ _id: postId, author: userId });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found or unauthorized",
      });
    }

    if (content !== undefined) article.content = sanitizeHtml(content);
    if (title !== undefined) article.title = title;
    if (status !== undefined) article.status = status;
    if (coverImage !== undefined) article.coverImage = coverImage;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (topics !== undefined) article.topics = topics;

    await article.save();

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @description Get all user articles (drafts/published)
 * @route GET /api/editor
 * @access Private
 */
export async function getArticles(req, res, next) {
  try {
    const userId = req.user._id;

    const articles = await AiArticle.find({ author: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      articles,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @description Delete an article
 * @route DELETE /api/editor/:postId
 * @access Private
 */
export async function deleteArticle(req, res, next) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const article = await AiArticle.findOneAndDelete({ _id: postId, author: userId });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @description Get all published articles for feed
 * @route GET /api/editor/feed
 * @access Private
 */
export async function getFeedArticles(req, res, next) {
  try {
    const articles = await AiArticle.find({ status: "published" })
      .populate("author", "username email avatar")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      articles,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @description Create a new article manually
 * @route POST /api/editor
 * @access Private
 */
export async function createArticle(req, res, next) {
  try {
    const userId = req.user._id;
    const { title, content, status, coverImage, excerpt, topics } = req.body;

    const article = await AiArticle.create({
      title: title || "Untitled Article",
      content: sanitizeHtml(content || ""),
      author: userId,
      aiGenerated: false,
      status: status || "draft",
      coverImage,
      excerpt,
      topics,
    });

    res.status(201).json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @description Get a published article by ID or Slug publicly
 * @route GET /api/editor/public/:postId
 * @access Public
 */
export async function getPublicArticle(req, res, next) {
  try {
    const { postId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(postId);

    const query = isObjectId
      ? { $or: [{ _id: postId }, { slug: postId }] }
      : { slug: postId };

    const article = await AiArticle.findOne(query).populate(
      "author",
      "username email avatar"
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (!article.slug) {
      const baseSlug = article.title ? article.title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "") : "untitled";
      await AiArticle.updateOne({ _id: article._id }, { $set: { slug: baseSlug } });
      article.slug = baseSlug;
    }

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
}

