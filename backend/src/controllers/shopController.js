import pool from "../config/db.js";

// CREATE SHOP
export const createShop = async (req, res) => {
  try {
    const { shop_name, address, latitude, longitude } = req.body;

    const result = await pool.query(
  `INSERT INTO shops (owner_id, shop_name, address, latitude, longitude)
   VALUES ($1, $2, $3, $4, $5) RETURNING *`,
  [req.user.id, shop_name, address, latitude, longitude]
);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating shop" });
  }
};

// GET MY SHOP
export const getMyShop = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM shops WHERE owner_id = $1",
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop" });
  }
};

// UPDATE SHOP ACTIVE STATUS
export const updateShopStatus = async (req, res) => {
  try {
    const { is_active } = req.body;

    // Find shop of logged-in owner
    const shopResult = await pool.query(
      "SELECT * FROM shops WHERE owner_id = $1",
      [req.user.id]
    );

    if (shopResult.rows.length === 0) {
      return res.status(404).json({
        message: "Shop not found",
      });
    }

    // Update status
    const result = await pool.query(
      `UPDATE shops
       SET is_active = $1
       WHERE owner_id = $2
       RETURNING *`,
      [is_active, req.user.id]
    );

    res.json({
      message: `Shop is now ${
        is_active ? "ONLINE 🟢" : "OFFLINE 🔴"
      }`,
      shop: result.rows[0],
    });

  } catch (error) {
    console.error("Update Shop Status Error:", error);

    res.status(500).json({
      message: "Error updating shop status",
    });
  }
};