// backend/src/modules/order.js

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Built-in node package to generate SHA-256 genesis hashes
const { Order, Product, User } = require("../db");
const { addBlock, getLedger } = require("./blockchain");

console.log("DEBUG: Models loaded ->", {
  Order: !!Order,
  Product: !!Product,
  User: !!User,
});

// Transporter updated with your provided credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "zenvy.services@gmail.com",
    pass: "jpqetesbrkzeitmg",
  },
});

// Helper function to send multi-step milestone emails
const sendOrderEmail = async (customerUser, order, stepIndex, otp = null) => {
  if (!customerUser || !customerUser.email) return;

  const steps = [
    "Order Placed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  // Generate the UNIQUE Vertical Blockchain Stack milestone tracker
  let progressHtml = `<div style="margin: 40px 0; padding: 10px;">`;

  steps.forEach((step, index) => {
    const isCompleted = index < stepIndex;
    const isCurrent = index === stepIndex;

    let bgColor,
      borderColor,
      borderStyle,
      shadow,
      icon,
      statusText,
      statusColor,
      textColor;

    if (isCompleted) {
      bgColor = "#ffffff";
      borderColor = "#0f172a";
      borderStyle = "solid";
      shadow = "4px 4px 0px #10b981"; // Green shadow
      icon = '<span style="color: #10b981; font-size: 24px;">✔</span>';
      statusText = "VERIFIED";
      statusColor = "#10b981";
      textColor = "#0f172a";
    } else if (isCurrent) {
      bgColor = "#fba01d"; // Zenvy Yellow
      borderColor = "#0f172a";
      borderStyle = "solid";
      shadow = "6px 6px 0px #6125a8"; // Purple shadow
      icon = '<span style="font-size: 28px;">🚚</span>';
      statusText = "HAPPENING NOW";
      statusColor = "#6125a8";
      textColor = "#0f172a";
    } else {
      bgColor = "#f8fafc";
      borderColor = "#94a3b8";
      borderStyle = "dashed";
      shadow = "none";
      icon = '<span style="color: #94a3b8; font-size: 18px;">🔒</span>';
      statusText = "LOCKED";
      statusColor = "#94a3b8";
      textColor = "#64748b";
    }

    // Connector line logic between stacked blocks
    const hasNext = index < steps.length - 1;
    let connector = "";
    if (hasNext) {
      const connColor = isCompleted ? "#0f172a" : "#cbd5e1";
      const connStyle = isCompleted ? "solid" : "dashed";
      connector = `<div style="margin-left: 40px; border-left: 4px ${connStyle} ${connColor}; height: 24px;"></div>`;
    }

    progressHtml += `
        <div style="background-color: ${bgColor}; border: 3px ${borderStyle} ${borderColor}; border-radius: 16px; box-shadow: ${shadow}; padding: 16px 20px; display: flex; align-items: center; position: relative; z-index: 2;">
            <div style="width: 45px; text-align: center; margin-right: 15px;">${icon}</div>
            <div>
                <div style="font-size: 11px; font-weight: 900; color: ${statusColor}; letter-spacing: 1.5px; text-transform: uppercase;">${statusText}</div>
                <div style="font-size: 20px; font-weight: 900; color: ${textColor}; margin-top: 2px;">${step}</div>
            </div>
        </div>
        ${connector}
        `;
  });

  progressHtml += `</div>`;

  // Dynamic message based on step
  let message = "";
  if (stepIndex === 0)
    message = `We've received your order for <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> and are processing it now!`;
  else if (stepIndex === 1)
    message = `Good news! Your <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> has been safely packed and is waiting for pickup.`;
  else if (stepIndex === 2)
    message = `Your <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> has been picked up by our logistics partner and is on its way!`;
  else if (stepIndex === 3)
    message = `Your <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> is out for delivery today! To securely receive your package, please provide this password to your delivery hero:`;
  else if (stepIndex === 4)
    message = `Hooray! Your <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> has been successfully delivered. Enjoy!`;

  // "Tear-off Ticket" OTP block (only for Out for Delivery)
  let otpSection = "";
  if (otp) {
    otpSection = `
        <div style="margin: 40px 0; background-color: #6125a8; border: 4px solid #0f172a; border-radius: 20px; text-align: center; box-shadow: 8px 8px 0px #1bb2e8; overflow: hidden;">
            <div style="background-color: #fba01d; padding: 20px; border-bottom: 4px dashed #0f172a;">
                <span style="font-size: 16px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 3px;">Top Secret Delivery Code</span>
            </div>
            <div style="padding: 35px 20px; background-color: #ffffff;">
                <span style="display: inline-block; font-size: 56px; font-weight: 900; color: #6125a8; letter-spacing: 16px; text-shadow: 3px 3px 0px #1bb2e8; margin-left: 16px;">${otp}</span>
            </div>
        </div>
        
        <div style="background-color: #f0f9ff; border: 3px solid #0f172a; border-radius: 16px; padding: 15px 20px; display: flex; align-items: center; box-shadow: 4px 4px 0px rgba(15,23,42,0.15);">
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #0f172a; font-weight: 500;">
                <strong style="color: #1bb2e8; font-size: 16px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">🚨 Keep it secret!</strong> 
                Please do not share this code over the phone. Only share it in person when your package is handed to you.
            </p>
        </div>
        `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 40px 20px; background-color: #f3e8ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 4px solid #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 10px 10px 0px #6125a8;">
            
            <div style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 4px dashed #0f172a;">
                <h1 style="margin: 0; color: #6125a8; font-size: 38px; font-weight: 900; letter-spacing: 6px; text-transform: uppercase; text-shadow: 2px 2px 0px #1bb2e8;">ZENVY</h1>
            </div>
            
            <div style="padding: 40px 30px;">
                <h2 style="margin-top: 0; font-size: 26px; color: #0f172a; font-weight: 900; text-transform: uppercase;">Hey ${customerUser.name || "there"}! 🎉</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #334155; font-weight: 600;">${message}</p>
                
                ${progressHtml}
                ${otpSection}
                
            </div>
            
            <div style="background-color: #0f172a; padding: 25px; text-align: center;">
                <p style="margin: 0; font-size: 14px; font-weight: 800; color: #1bb2e8; text-transform: uppercase; letter-spacing: 2px;">Secured by Zenvy Blockchain</p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #94a3b8; font-weight: 600;">&copy; 2026 Zenvy Logistics. All rights reserved.</p>
            </div>
        </div>
    </div>
    </html>
    `;

  try {
    await transporter.sendMail({
      from: '"Zenvy Logistics" <zenvy.services@gmail.com>',
      to: customerUser.email,
      subject: `📦 Zenvy Update: ${steps[stepIndex]}`,
      html: html,
    });
    console.log(
      `Milestone email sent to ${customerUser.email} (Step: ${steps[stepIndex]})`,
    );
  } catch (err) {
    console.error("Failed to send milestone email:", err);
  }
};

// GET: Fetch all active lifecycle orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Trigger new checkout, compile dynamic SHA-256 hash stack, and lock funds in escrow
router.post("/", async (req, res) => {
  try {
    const {
      orderId,
      productId,
      productName,
      customer,
      supplier,
      price,
      ethPrice,
    } = req.body;

    // 1. Compile the dynamic unique Genesis metadata seed block
    const metadataSeed = `${orderId}-${customer}-${price}-${Date.now()}`;
    const generatedGenesisHash = crypto
      .createHash("sha256")
      .update(metadataSeed)
      .digest("hex");

    // 2. Isolate the exact last 6 characters to act as the TLV cryptographic OTP key
    const extractedSuffixCode = generatedGenesisHash.slice(-6).toUpperCase();

    const newOrder = new Order({
      orderId,
      productId,
      productName,
      customer,
      supplier,
      price,
      ethPrice,
      genesisHash: generatedGenesisHash,
      hashSuffix: extractedSuffixCode,
      status: "PAYMENT_LOCKED",
      trackingHistory: [
        { status: "PAYMENT_LOCKED", location: "Escrow Contract Ledger" },
      ],
    });

    await newOrder.save();

    // Adjust client wallets and item inventory numbers safely
    await Product.findOneAndUpdate(
      { tokenId: productId },
      { $inc: { stock: -1 } },
    );
    await User.findOneAndUpdate(
      { id: customer },
      { $inc: { walletBalance: -price } },
    );

    // Log to Hardhat local blockchain instance
    await addBlock(
      "CUSTOMER_PAID",
      `Customer paid ${price} for ${productName}. Funds securely held inside escrow configuration stack.`,
      newOrder.orderId,
    );

    // Send Milestone 0: Ordered Email Notification
    try {
      const customerUser = await User.findOne({ id: customer });
      await sendOrderEmail(customerUser, newOrder, 0);
    } catch (mailErr) {
      console.error("Non-blocking order mail failure:", mailErr.message);
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Advance timeline milestone updates dynamically
router.put("/:id", async (req, res) => {
  try {
    const { status, location, logisticsPartner, deliveryAgent } = req.body;
    const orderId = req.params.id;

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    if (logisticsPartner) order.logisticsPartner = logisticsPartner;
    if (deliveryAgent) order.deliveryAgent = deliveryAgent;

    order.trackingHistory.push({ status, location, timestamp: new Date() });
    await order.save();

    let action = "STATUS_UPDATED";
    const customerUser = await User.findOne({ id: order.customer });

    // Sequential Tracking Logic Flow Matching Flowchart Nodes
    if (status === "PACKED") {
      action = "ITEM_PACKED";
      await sendOrderEmail(customerUser, order, 1);
    } else if (status === "SHIPPED") {
      action = "ITEM_SHIPPED";
      await sendOrderEmail(customerUser, order, 2);
    } else if (status === "OUT_FOR_DELIVERY") {
      action = "OUT_FOR_DELIVERY";
      // Dynamically inject the hashSuffix directly into the email template
      await sendOrderEmail(customerUser, order, 3, order.hashSuffix);
    } else if (status === "DELIVERED") {
      action = "DELIVERED";
      await sendOrderEmail(customerUser, order, 4);

      // Release funds out of the escrow configuration loop into Supplier's balance account
      await User.findOneAndUpdate(
        { id: order.supplier },
        { $inc: { walletBalance: order.price } },
      );
      await addBlock(
        "PAYMENT_RELEASED",
        `Cryptographic matching success. Payment of ${order.price} unlocked for Supplier.`,
        orderId,
        location,
      );
    } else if (status === "REFUNDED") {
      action = "REFUND_ISSUED";
      await User.findOneAndUpdate(
        { id: order.supplier },
        { $inc: { walletBalance: -order.price } },
      );
      await User.findOneAndUpdate(
        { id: order.customer },
        { $inc: { walletBalance: order.price } },
      );
      await Product.findOneAndUpdate(
        { tokenId: order.productId },
        { $inc: { stock: 1 } },
      );
    }

    await addBlock(
      action,
      `Order status advanced: ${status}`,
      orderId,
      location,
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: Last-Mile Handshake Cryptographic Verification Verification Node
router.post("/verify", async (req, res) => {
  try {
    const { orderId, inputOtp } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order)
      return res
        .status(404)
        .json({
          error: "Verification failed. Order context matching not found.",
        });

    if (order.status !== "OUT_FOR_DELIVERY") {
      return res
        .status(400)
        .json({
          error: "Order timeline state not configured for delivery validation.",
        });
    }

    // Match input values directly against stored hash suffix keys
    if (inputOtp.toUpperCase() !== order.hashSuffix) {
      return res
        .status(401)
        .json({
          error:
            "MISMATCH: Cryptographic delivery verification challenge failed.",
        });
    }

    // Perform atomic completion workflow updates directly upon verification match
    order.status = "DELIVERED";
    order.trackingHistory.push({
      status: "DELIVERED",
      location: "Customer Handover Destination",
    });
    await order.save();

    // Release locked token assets to Supplier account profile
    await User.findOneAndUpdate(
      { id: order.supplier },
      { $inc: { walletBalance: order.price } },
    );

    // Log transaction completion block entry to blockchain
    await addBlock(
      "DELIVERED",
      `Verification success. Order finalized under block index.`,
      orderId,
      "Last-Mile Endpoint",
    );

    // Send confirmation email
    try {
      const customerUser = await User.findOne({ id: order.customer });
      await sendOrderEmail(customerUser, order, 4);
    } catch (e) {}

    res.json({
      success: true,
      message: "Handshake verified successfully. Escrow released.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all products for the search functionality
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
