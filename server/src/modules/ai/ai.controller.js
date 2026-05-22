import { redis } from "../../config/redis.js";
import AiArticle from "./ai.model.js";
import { generateArticleService } from "./ai.service.js";
import { createArticlePrompt } from "./prompts/article.prompt.js";

/**
 * @description Generate an article using real-time streaming and save as a draft
 * @route POST /api/ai/generate-article
 * @access Private
 */
export async function generateArticleController(req, res, next) {
  const userId = req.user._id;
  const cooldownKey = `generate_article_cooldown_${userId}`;

  try {
    const { topic, tone, length, category } = req.body;

    // 1. Validate required fields
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required.",
      });
    }

    // 2. Check for existing rate-limit cooldown
    const existingCooldown = await redis.get(cooldownKey);
    if (existingCooldown) {
      return res.status(429).json({
        success: false,
        message: "Please wait before generating another article.",
      });
    }

    const prompt = createArticlePrompt(topic, tone, length, category);

    // 3. Request the stream object from your service layer
    const responseStream = await generateArticleService(prompt);

    // 4. Set HTTP streaming headers to establish an open chunked connection
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let fullText = "";

    // 5. Iterate over the incoming stream chunks from Gemini
    for await (const chunk of responseStream) {
      const chunkText = chunk.text || "";
      fullText += chunkText;

      // Flush text directly down the open socket to your frontend UI
      res.write(chunkText);
    }

    // 6. Save to DB before closing the connection so we can return the ID
    let articleId = "";
    try {
      const article = await AiArticle.create({
        title: topic,
        content: fullText,
        author: userId,
        aiGenerated: true,
        status: "draft",
        generationMeta: { tone, length, category },
      });
      articleId = article._id;
    } catch (dbError) {
      console.error("Database Save Error during stream completion:", dbError);
    }

    // 7. Write metadata delimiter and ID to the client
    if (articleId) {
      res.write(`\n__METADATA__:${articleId}`);
    }

    // 8. Tell the client we are done streaming data
    res.end();

    // 9. Safely activate the 1-minute cooldown now that all processing is done
    await redis.set(cooldownKey, "1", { EX: 60 });
  } catch (error) {
    console.error("Error generating article stream:", error);

    // Safety net: clean up the Redis lock if things crashed mid-operation
    await redis.del(cooldownKey).catch(() => {});

    // If headers haven't gone out yet, send a clean JSON error response
    if (!res.headersSent) {
      return next(error);
    }

    // If headers already went out, we can't change the status code anymore.
    // Just terminate the open stream early.
    res.end();
  }
}
