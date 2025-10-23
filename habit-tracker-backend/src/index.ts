import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/db";
import authRoutes from "./routes/auth";
import habitRoutes from "./routes/habit";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  await testConnection();
});
