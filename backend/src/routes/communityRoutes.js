import express from "express";
import { getCommunityMessages } from "../controllers/communityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCommunityMessages);

export default router;