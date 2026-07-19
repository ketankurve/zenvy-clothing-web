const mongoose = require("mongoose");

// FIX: Direct import of the already-compiled Product model
const Product = require("./models/Product");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🚀 MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// --- ROLE-BASED USER SCHEMA ---
const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: [
        "MANUFACTURER",
        "SUPPLIER",
        "LOGISTICS",
        "DELIVERY_AGENT",
        "CUSTOMER",
      ],
    },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// --- TRANSACTION-LINKED VERIFICATION (TLV) ORDER SCHEMA ---
const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    customer: { type: String, required: true }, // Customer ID
    supplier: { type: String, required: true }, // Supplier ID
    logisticsPartner: { type: String, default: "" },
    deliveryAgent: { type: String, default: "" },
    price: { type: Number, required: true },
    ethPrice: { type: String, required: true },

    // Cryptographic Ledger Fields
    genesisHash: { type: String, required: true }, // 64-character SHA-256 string
    hashSuffix: { type: String, required: true }, // Extracted last 6 chars for OTP validation

    status: {
      type: String,
      required: true,
      enum: [
        "PAYMENT_LOCKED",
        "PACKED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "REFUNDED",
      ],
      default: "PAYMENT_LOCKED",
    },

    // Real-time timeline milestones
    trackingHistory: [
      {
        status: { type: String, required: true },
        location: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
const Order = mongoose.model("Order", OrderSchema);

// Export everything required across your ecosystem modules
module.exports = {
  connectDB,
  User,
  Order,
  Product,
};
