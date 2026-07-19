const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // Add this
const Product = require("../models/Product");
const { User } = require("../db");
const { addBlock } = require("./blockchain");

// GET: All products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });

    const formattedProducts = products.map((p) => ({
      id: p.tokenId, // Use tokenId as the primary ID
      name: p.name,
      // Ensure we use the exact field names present in your MongoDB documents
      price: `$${p.price || p.retail || 0}`,
      ethPrice: `${((p.price || p.retail || 0) / 3000).toFixed(4)} ETH`,
      category: (p.category || "GENERAL").toUpperCase(),
      img:
        p.img ||
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
      tokenId: p.tokenId,
      isMinted: true,
    }));

    res.json(formattedProducts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST: Add new product
router.post("/", async (req, res) => {
  try {
    // Maps the incoming frontend JSON to your Mongoose Schema safely
    const newProduct = new Product({
      name: req.body.name,
      price: Number(req.body.price),
      ethPrice: req.body.ethPrice,
      category: req.body.category,
      img: req.body.img,
      tokenId: req.body.tokenId,
      isMinted: req.body.isMinted ?? true,
    });

    await newProduct.save();

    // Wrap blockchain call in try/catch to prevent API crashes
    try {
      await addBlock(
        "PRODUCT_MINTED",
        `Admin dynamically listed: ${newProduct.name}`, // Updated log text
        newProduct.tokenId, // Uses the correct unique Token ID now
        "Admin Portal",
      );
    } catch (blockchainErr) {
      console.error("Blockchain logging failed:", blockchainErr.message);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Dynamic POST Error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Update Authorized Suppliers
router.put("/:id/authorize", async (req, res) => {
  try {
    const { authorizedSuppliers } = req.body;
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { authorizedSuppliers },
      { new: true },
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Procure Inventory
router.post("/procure", async (req, res) => {
  try {
    const { mfgProductId, supplierId, quantity } = req.body;
    const mfgProduct = await Product.findOne({ id: mfgProductId });
    const supplier = await User.findOne({ id: supplierId });

    if (!mfgProduct || !supplier)
      return res.status(404).json({ error: "Product or Supplier not found" });
    if (mfgProduct.stock < quantity)
      return res.status(400).json({ error: "Not enough stock available" });

    const totalCost = mfgProduct.wholesale * quantity;
    if (supplier.walletBalance < totalCost)
      return res.status(400).json({ error: "Insufficient wallet balance" });

    mfgProduct.stock -= quantity;
    await mfgProduct.save();

    supplier.walletBalance -= totalCost;
    await supplier.save();
    await User.findOneAndUpdate(
      { id: mfgProduct.creatorId },
      { $inc: { walletBalance: totalCost } },
    );

    const supProdId = `${mfgProduct.baseId}-${supplierId}`;
    let supProduct = await Product.findOne({ id: supProdId });

    if (supProduct) {
      supProduct.stock += quantity;
      await supProduct.save();
    } else {
      const prodData = mfgProduct.toObject();
      delete prodData._id;
      supProduct = new Product({
        ...prodData,
        id: supProdId,
        owner: supplierId,
        stock: quantity,
        authorizedSuppliers: [],
      });
      await supProduct.save();
    }

    try {
      await addBlock(
        "SUPPLIER_PROCUREMENT",
        `Supplier ${supplierId} procured ${quantity} units of ${mfgProduct.name} for ₹${totalCost}`,
        mfgProduct.baseId,
      );
    } catch (e) {
      console.error("Blockchain error:", e.message);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit Product Name and Retail Price
router.put("/:id", async (req, res) => {
  try {
    const { name, retail } = req.body;
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.name = name;
    product.retail = retail;
    await product.save();

    try {
      await addBlock(
        "PRODUCT_UPDATED",
        `Supplier updated display name to "${name}" and price to ₹${retail}`,
        product.id,
      );
    } catch (e) {
      console.error("Blockchain error:", e.message);
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Data Seeding Tool
router.post("/seed/demo-data", async (req, res) => {
  try {
    // We use the 'Product' model imported at the top
    await Product.deleteMany({});

    const showcaseGarments = [
      {
        name: "Zenvy Minimalist Sherpa Hoodie",
        category: "OUTERWEAR",
        price: 4500,
        ethPrice: "0.0150",
        img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        tokenId: "M101",
        isMinted: true,
      },
      {
        name: "Organic Heavyweight Box Tee",
        category: "TEES",
        price: 2200,
        ethPrice: "0.0073",
        img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
        tokenId: "M102",
        isMinted: true,
      },
      {
        name: "Premium Modular Cotton Overshirt",
        category: "SHIRTS",
        price: 5500,
        ethPrice: "0.0183",
        img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600",
        tokenId: "M103",
        isMinted: true,
      },
      {
        name: "Cyberpunk Technical Windbreaker",
        category: "OUTERWEAR",
        price: 7200,
        ethPrice: "0.0240",
        img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600",
        tokenId: "M104",
        isMinted: true,
      },
      {
        name: "Vintage Waffle Knit Sweater",
        category: "SHIRTS",
        price: 3800,
        ethPrice: "0.0127",
        img: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600",
        tokenId: "M105",
        isMinted: true,
      },
      {
        name: "Classic Drop-Shoulder Tee",
        category: "TEES",
        price: 1800,
        ethPrice: "0.0060",
        img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600",
        tokenId: "M106",
        isMinted: true,
      },
    ];

    const insertedItems = await Product.insertMany(showcaseGarments);

    try {
      await addBlock(
        "DEMO_LEDGER_INIT",
        `Initialized catalog with ${insertedItems.length} items.`,
        "SYSTEM",
      );
    } catch (e) {
      console.error("Blockchain error during seeding:", e.message);
    }

    res.status(201).json({ message: "Seeded!", data: insertedItems });
  } catch (err) {
    console.error("Seeding error:", err); // Log the full error to your terminal
    res.status(500).json({ error: "Seeding failed", details: err.message });
  }
});

module.exports = router;
