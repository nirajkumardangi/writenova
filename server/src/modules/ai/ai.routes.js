import express from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { generateArticleController } from "./ai.controller.js";

const router = express.Router();

router.post("/generate-article", protect, generateArticleController);

export default router;
