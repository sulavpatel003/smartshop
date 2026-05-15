import pool from "../config/db.js";

// GET ALL MESSAGES
export const getCommunityMessages = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cm.*, u.name
      FROM community_messages cm
      JOIN users u ON cm.user_id = u.id
      ORDER BY cm.id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};