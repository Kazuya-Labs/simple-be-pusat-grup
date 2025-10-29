require("dotenv").config();
const express = require("express");
const cors = require("cors"); // <--- tambahkan ini
const routes = require("./src/routes.js");
const connectDB = require("./src/database");

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware Global ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    scure : true
  })
);

// --- Database Connection ---
connectDB();

// --- Logging Middleware ---
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// --- Routes ---
app.use("/api/v1", routes);

// --- Error Handler ---
app.use((error, req, res, next) => {
  console.error("Unhandled Error:", error);
  res.status(500).json({ message: "Internal Server Error" });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});