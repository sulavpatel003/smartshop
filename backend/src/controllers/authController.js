import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    // 🔥 CHANGE 1: ADD ROLE HERE
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 CHANGE 2: INSERT ROLE
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role || "customer"]
    );

    const token = generateToken(newUser.rows[0]);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 ROLE ALREADY INCLUDED IN USER OBJECT
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user, // 👈 includes role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};