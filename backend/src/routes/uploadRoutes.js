import express from "express";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  res.json({
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});

export default router;