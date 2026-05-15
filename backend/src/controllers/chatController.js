import pool from "../config/db.js";

// 👉 CREATE OR GET CONVERSATION
export const startConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shop_id } = req.body;

    // check if exists
    const existing = await pool.query(
      `SELECT * FROM conversations 
       WHERE customer_id=$1 AND shop_id=$2`,
      [userId, shop_id]
    );

    if (existing.rows.length > 0) {
      return res.json(existing.rows[0]);
    }

    // create new
    const result = await pool.query(
      `INSERT INTO conversations (customer_id, shop_id)
       VALUES ($1, $2) RETURNING *`,
      [userId, shop_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error starting chat" });
  }
};

// 👉 GET USER CONVERSATIONS
export const getMyChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT c.*, s.shop_name, u.name as customer_name
      FROM conversations c
      JOIN shops s ON c.shop_id = s.id
      JOIN users u ON c.customer_id = u.id
      WHERE c.customer_id = $1 OR s.owner_id = $1
      ORDER BY c.id DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats" });
  }
};

// 👉 GET MESSAGES
export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT m.*, u.name
FROM messages m
JOIN users u ON m.sender_id = u.id
WHERE m.conversation_id = $1
ORDER BY m.created_at ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};