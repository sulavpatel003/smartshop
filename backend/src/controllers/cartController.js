import pool from "../config/db.js";

// 👉 GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartResult = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.json([]);
    }

    const cartId = cartResult.rows[0].id;

    const items = await pool.query(
      `SELECT ci.*, p.name, p.price, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};



// 👉 ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    // 1. Get or create cart
    let cart = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [userId]
    );

    if (cart.rows.length === 0) {
      cart = await pool.query(
        "INSERT INTO cart (user_id) VALUES ($1) RETURNING *",
        [userId]
      );
    }

    const cartId = cart.rows[0].id;

    // 2. Check if item exists
    const existing = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id=$1 AND product_id=$2",
      [cartId, product_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE id = $1",
        [existing.rows[0].id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1,$2,1)",
        [cartId, product_id]
      );
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to cart" });
  }
};



// 👉 UPDATE QUANTITY
export const updateCart = async (req, res) => {
  try {
    const { item_id, quantity } = req.body;

    await pool.query(
      "UPDATE cart_items SET quantity=$1 WHERE id=$2",
      [quantity, item_id]
    );

    res.json({ message: "Cart updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating cart" });
  }
};



// 👉 REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const { item_id } = req.params;

    await pool.query(
      "DELETE FROM cart_items WHERE id=$1",
      [item_id]
    );

    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Error removing item" });
  }
};



// 👉 CLEAR CART (checkout)
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await pool.query(
      "SELECT id FROM cart WHERE user_id=$1",
      [userId]
    );

    if (cart.rows.length > 0) {
      await pool.query(
        "DELETE FROM cart_items WHERE cart_id=$1",
        [cart.rows[0].id]
      );
    }

    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};