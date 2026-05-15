import express from "express";
import {
  createShop,
  getMyShop,
  updateShopStatus,
} from "../controllers/shopController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createShop);
router.get("/my", protect, getMyShop);
router.put("/status", protect, updateShopStatus);

export default router;