import express from "express";
import {
  createOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/shop", protect, getShopOrders);
router.put("/:id/status", protect, updateOrderStatus);

export default router;