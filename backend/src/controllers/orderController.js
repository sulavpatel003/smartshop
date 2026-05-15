import pool from "../config/db.js";

// CREATE ORDER

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { delivery_type } = req.body;

    // 1. Get cart
    const cartResult = await pool.query(
      "SELECT id FROM cart WHERE user_id=$1",
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartId = cartResult.rows[0].id;

    // 2. Get cart items
    const items = await pool.query(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (items.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 3. Calculate total
    let total = 0;
    items.rows.forEach(item => {
      total += item.price * item.quantity;
    });

    // 4. Create order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_amount, payment_status, delivery_type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, total, "paid", delivery_type]
    );

    const orderId = orderResult.rows[0].id;

    // 5. Insert order items
    for (let item of items.rows) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [orderId, item.product_id, item.quantity]
      );
    }

    // 6. CLEAR CART
    await pool.query(
      "DELETE FROM cart_items WHERE cart_id=$1",
      [cartId]
    );

    res.json({
      message: "Order created successfully",
      order: orderResult.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(orders.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// GET ORDERS FOR SHOP OWNER
// GET ORDERS FOR SHOP OWNER (DETAILED)
export const getShopOrders = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        o.id AS order_id,
        o.total_amount,
        o.payment_status,
        o.delivery_type,
        o.created_at,

        oi.quantity,

        p.name AS product_name,
        p.price,

        s.shop_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN shops s ON p.shop_id = s.id
      WHERE s.owner_id = $1
      ORDER BY o.id DESC
      `,
      [ownerId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching shop orders" });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order status" });
  }
};