import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware, requireRole } from "./middleware/auth.js";
import kbRoutes from './routes/kbRoutes.js';
import ticketRoutes from "./routes/ticketRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import triageRoutes from "./routes/triageRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import configRoutes from "./routes/configRoutes.js";


dotenv.config();

const app = express();

// CORS setup (only allow frontend origin)
const allowed = [process.env.CLIENT_ORIGIN || "http://localhost:5173"];
app.use(cors({ origin: allowed, credentials: false }));

// Middleware
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/tickets", ticketRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/config", configRoutes);

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Helpdesk API running 🚀" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.role}, you are authorized ✅` });
});

app.get(
  "/api/admin-only",
  authMiddleware,
  requireRole(["admin"]),
  (req, res) => {
    res.json({ message: "Welcome Admin, you can manage KB articles 🚀" });
  }
);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use('/api/kb', kbRoutes);


const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
