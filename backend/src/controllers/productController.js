import pool from "../config/db.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image_url } = req.body;

    // Get user's shop
    const shopResult = await pool.query(
      "SELECT * FROM shops WHERE owner_id = $1",
      [req.user.id]
    );

    if (shopResult.rows.length === 0) {
      return res.status(400).json({ message: "Create a shop first" });
    }

    const shop_id = shopResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO products (shop_id, name, price, description, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [shop_id, name, price, description, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
  p.*, 
  s.shop_name,
  s.latitude, 
  s.longitude,
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(r.id) AS total_reviews
FROM products p
JOIN shops s ON p.shop_id = s.id
LEFT JOIN reviews r ON p.id = r.product_id
WHERE s.is_active = true
GROUP BY p.id, s.shop_name, s.latitude, s.longitude
ORDER BY p.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
  p.*, 
  s.shop_name,
  s.latitude, 
  s.longitude,
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(r.id) AS total_reviews
FROM products p
JOIN shops s ON p.shop_id = s.id
LEFT JOIN reviews r ON p.id = r.product_id
WHERE p.id = $1
AND s.is_active = true
GROUP BY p.id, s.shop_name, s.latitude, s.longitude
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image_url } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name=$1, price=$2, description=$3, image_url=$4
       WHERE id=$5 RETURNING *`,
      [name, price, description, image_url, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [
      req.params.id,
    ]);

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

// SEARCH PRODUCTS
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    const result = await pool.query(
      `SELECT p.*, s.shop_name
FROM products p
JOIN shops s ON p.shop_id = s.id
WHERE s.is_active = true
AND (
  p.name ILIKE $1
  OR p.description ILIKE $1
)`,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Search error" });
  }
};

export const getNearbyProducts = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "Location required" });
    }
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const MAX_DISTANCE = 10;
    
    const result = await pool.query(`
      SELECT p.*,s.shop_name, s.latitude, s.longitude
      FROM products p
      JOIN shops s ON p.shop_id = s.id
      WHERE s.latitude IS NOT NULL AND s.longitude IS NOT NULL
      AND s.is_active = true
    `);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km

      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +                                                              
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    };

    const nearbyProducts = result.rows
  .map((p) => {
    if (!p.latitude || !p.longitude) return null;

    const distance = calculateDistance(
      userLat,
      userLng,
      parseFloat(p.latitude),
      parseFloat(p.longitude)
    );
    return {
      ...p,
      distance,
    };
  })
  .filter((p) => p && p.distance <= MAX_DISTANCE)
  .sort((a, b) => a.distance - b.distance);

    res.json(nearbyProducts);
  } catch (error) {
  console.error("🔥 Nearby API Error:", error); 
  res.status(500).json({ message: "Error fetching nearby products" });
}
};


// GET MY PRODUCTS (SHOP OWNER)
export const getMyProducts = async (req, res) => {
  try {

    // get shop of logged in owner
    const shopResult = await pool.query(
      "SELECT * FROM shops WHERE owner_id = $1",
      [req.user.id]
    );

    if (shopResult.rows.length === 0) {
      return res.json([]);
    }

    const shopId = shopResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE shop_id = $1
      ORDER BY id DESC
      `,
      [shopId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching my products",
    });
  }
};