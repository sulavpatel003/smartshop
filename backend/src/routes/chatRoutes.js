import express from "express";
import {
  startConversation,
  getMyChats,
  getMessages,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "../config/db.js";

const router = express.Router();

// ✅ Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ✅ AI CHAT ROUTE
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ 1. Fetch products from DB
    const productsResult = await pool.query(`
      SELECT p.name, p.price, p.description, s.shop_name
      FROM products p
      JOIN shops s ON p.shop_id = s.id
      ORDER BY p.id DESC
      LIMIT 20
    `);

    const products = productsResult.rows;

    // ✅ 2. Convert DB data to readable text
    const productContext = products
      .map(
        (p) =>
          `${p.name} - ₹${p.price} - ${p.shop_name} (${p.description})`
      )
      .join("\n");

    // ✅ 3. Create SMART PROMPT
    const prompt = `
You are an AI assistant for a local shopping platform called "LocalFinder".

You help users find products, shops, prices, and recommendations.

Here are available products:

${productContext}

User question: ${message}

Rules:
- Answer ONLY based on given products
- Be short and helpful
- Recommend products if possible
- Mention shop name and price
`;

    // ✅ 4. Send to Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ message: "AI error" });
  }
});

// EXISTING ROUTES (DO NOT TOUCH)
router.post("/start", protect, startConversation);
router.get("/", protect, getMyChats);
router.get("/:id/messages", protect, getMessages);

export default router;