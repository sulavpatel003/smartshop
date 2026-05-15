import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", getReviews);           // get reviews
router.post("/:id", protect, addReview); // add review

export default router;