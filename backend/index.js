import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import requireAuth from "./middleware/requireAuth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadsPath = path.resolve("uploads");
app.use("/uploads", express.static(uploadsPath));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

app.get("/", (req, res) => {
  res.send("CareerBoard API running");
});

app.use("/auth", authRoutes);
app.use("/applications", requireAuth, applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
