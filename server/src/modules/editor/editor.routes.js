import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  updateArticle,
  getFeedArticles,
  getPublicArticle,
} from "./editor.controller.js";

const router = express.Router();

// Public route to view published articles
router.route("/public/:postId").get(getPublicArticle);

// Apply auth protection to all editor routes
router.use(protect);

router.route("/").get(getArticles).post(createArticle);

router.route("/feed").get(getFeedArticles);

router
  .route("/:postId")
  .get(getArticle)
  .put(updateArticle)
  .delete(deleteArticle);

export default router;
