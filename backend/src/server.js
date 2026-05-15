import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import http from "http";
import pool from "./config/db.js";
import communityRoutes from "./routes/communityRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smartshop-theta-bice.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static("src/uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://smartshop-theta-bice.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join conversation
  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
  });

//   // send message
//   socket.on("sendMessage", async (data) => {
//     const { conversation_id, sender_id, message } = data;

//     // save in DB
//     // const result = await pool.query(
//     //   `INSERT INTO messages (conversation_id, sender_id, message)
//     //    VALUES ($1, $2, $3) RETURNING *`,
//     //   [conversation_id, sender_id, message]
//     // );

//     // // broadcast
//     // io.to(conversation_id).emit("receiveMessage", result.rows[0]);
//     const result = await pool.query(
//   `INSERT INTO messages (conversation_id, sender_id, message)
//    VALUES ($1, $2, $3)
//    RETURNING *, NOW() as created_at`,
//   [conversation_id, sender_id, message]
// );

// // fetch user name
// const userResult = await pool.query(
//   `SELECT name FROM users WHERE id = $1`,
//   [sender_id]
// );

// const finalMessage = {
//   ...result.rows[0],
//   name: userResult.rows[0].name,
// };

// io.to(conversation_id).emit("receiveMessage", finalMessage);
//   });

socket.on("sendMessage", async (data) => {
  const {
    conversation_id,
    sender_id,
    message,
    image_url,
  } = data;

  const result = await pool.query(
    `INSERT INTO messages
    (conversation_id, sender_id, message, image_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *, NOW() as created_at`,
    [
      conversation_id,
      sender_id,
      message || null,
      image_url || null,
    ]
  );

  const userResult = await pool.query(
    `SELECT name FROM users WHERE id = $1`,
    [sender_id]
  );

  const finalMessage = {
    ...result.rows[0],
    name: userResult.rows[0].name,
  };

  io.to(conversation_id).emit(
    "receiveMessage",
    finalMessage
  );
});

  // COMMUNITY CHAT
socket.on("joinCommunity", () => {
  socket.join("community");
});

// socket.on("sendCommunityMessage", async (data) => {
//   const { user_id, message } = data;

//   const result = await pool.query(
//     `INSERT INTO community_messages (user_id, message)
//      VALUES ($1, $2)
//      RETURNING *`,
//     [user_id, message]
//   );

//   // get username
//   const user = await pool.query(
//     "SELECT name FROM users WHERE id = $1",
//     [user_id]
//   );

//   const messageData = {
//     ...result.rows[0],
//     name: user.rows[0].name,
//   };

//   io.to("community").emit("receiveCommunityMessage", messageData);
// });
socket.on("sendCommunityMessage", async (data) => {
  const {
    user_id,
    message,
    image_url,
  } = data;

  const result = await pool.query(
    `INSERT INTO community_messages
    (user_id, message, image_url)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [
      user_id,
      message || null,
      image_url || null,
    ]
  );

  const user = await pool.query(
    "SELECT name FROM users WHERE id = $1",
    [user_id]
  );

  const messageData = {
    ...result.rows[0],
    name: user.rows[0].name,
  };

  io.to("community").emit(
    "receiveCommunityMessage",
    messageData
  );
});
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
