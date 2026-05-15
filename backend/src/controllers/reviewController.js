import pool from "../config/db.js";

// ADD REVIEW
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET rating=$3, comment=$4
      RETURNING *
      `,
      [userId, productId, rating, comment]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding review" });
  }
};

// GET REVIEWS FOR PRODUCT
export const getReviews = async (req, res) => {
  try {
    const productId = req.params.id;

    const result = await pool.query(
      `
      SELECT r.*, u.name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
      `,
      [productId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};