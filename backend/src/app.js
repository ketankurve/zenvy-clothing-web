// backend/src/app.js

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

// Import routers
const authRoutes = require("./modules/auth");
const productRoutes = require("./modules/product");
const orderRoutes = require("./modules/order");
const { getLedger } = require("./modules/blockchain");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize MongoDB Atlas Connection
connectDB();

// API Route Registrations
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// System Health Status Check (Useful for pitch validation checks)
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date(),
    services: { database: "connected" },
  });
});

// Cryptographic Ledger Inspection Endpoint
app.get("/api/ledger", async (req, res) => {
  try {
    const ledger = await getLedger();
    res.json(ledger);
  } catch (err) {
    console.error("Ledger acquisition failure:", err.message);
    // Fallback array to keep UI from crashing if Hardhat node is restarting
    res.status(503).json({
      error: "Ledger temporarily offline",
      fallback: [],
      details: err.message,
    });
  }
});

module.exports = app;
