import AiArticle from "../ai/ai.model.js";

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

    // Build update object
    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (topics !== undefined) updateData.topics = topics;

    const article = await AiArticle.findOneAndUpdate(
      { _id: postId, author: userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found or unauthorized",
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
      content: content || "",
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
 * @description Get a published article by ID publicly
 * @route GET /api/editor/public/:postId
 * @access Public
 */
export async function getPublicArticle(req, res, next) {
  try {
    const { postId } = req.params;

    const article = await AiArticle.findOne({ _id: postId, status: "published" })
      .populate("author", "username email avatar");

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found or not published",
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

