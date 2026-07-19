const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer'); 
const { Order, Product, User } = require('../db');
const { addBlock, getLedger } = require('./blockchain'); 

// Transporter updated with your provided credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zenvy.services@gmail.com', 
        pass: 'jpqetesbrkzeitmg'     
    }
}); 

// Helper function to send multi-step milestone emails
const sendOrderEmail = async (customer, order, stepIndex, otp = null) => {
    if (!customer || !customer.email) return;

    const steps = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    
    // Generate the UNIQUE Vertical Blockchain Stack milestone tracker
    let progressHtml = `<div style="margin: 40px 0; padding: 10px;">`;
    
    steps.forEach((step, index) => {
        const isCompleted = index < stepIndex;
        const isCurrent = index === stepIndex;
        
        let bgColor, borderColor, borderStyle, shadow, icon, statusText, statusColor, textColor;

        if (isCompleted) {
            bgColor = '#ffffff';
            borderColor = '#0f172a';
            borderStyle = 'solid';
            shadow = '4px 4px 0px #10b981'; // Green shadow
            icon = '<span style="color: #10b981; font-size: 24px;">✔</span>';
            statusText = 'VERIFIED';
            statusColor = '#10b981';
            textColor = '#0f172a';
        } else if (isCurrent) {
            bgColor = '#fba01d'; // Zenvy Yellow
            borderColor = '#0f172a';
            borderStyle = 'solid';
            shadow = '6px 6px 0px #6125a8'; // Purple shadow
            icon = '<span style="font-size: 28px;">🚚</span>';
            statusText = 'HAPPENING NOW';
            statusColor = '#6125a8';
            textColor = '#0f172a';
        } else {
            bgColor = '#f8fafc';
            borderColor = '#94a3b8';
            borderStyle = 'dashed';
            shadow = 'none';
            icon = '<span style="color: #94a3b8; font-size: 18px;">🔒</span>';
            statusText = 'LOCKED';
            statusColor = '#94a3b8';
            textColor = '#64748b';
        }

        // Connector line logic between stacked blocks
        const hasNext = index < steps.length - 1;
        const isNextCurrent = index + 1 === stepIndex;
        let connector = '';
        if (hasNext) {
            const connColor = isCompleted ? '#0f172a' : '#cbd5e1';
            const connStyle = isCompleted ? 'solid' : 'dashed';
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
    let message = '';
    if (stepIndex === 0) message = `We've received your order for <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> and are processing it now!`;
    else if (stepIndex === 1) message = `Good news! Your <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> has been safely packed and is waiting for pickup.`;
    else if (stepIndex === 2) message = `Your <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> has been picked up by our logistics partner and is on its way!`;
    else if (stepIndex === 3) message = `Your <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> is out for delivery today! To securely receive your package, please provide this password to your delivery hero:`;
    else if (stepIndex === 4) message = `Hooray! Your <strong style="color: #fba01d; text-shadow: 1px 1px 0px rgba(251,160,29,0.3);">${order.productName}</strong> has been successfully delivered. Enjoy!`;

    // "Tear-off Ticket" OTP block (only for Out for Delivery)
    let otpSection = '';
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
                <h2 style="margin-top: 0; font-size: 26px; color: #0f172a; font-weight: 900; text-transform: uppercase;">Hey ${customer.name || 'there'}! 🎉</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #334155; font-weight: 600;">${message}</p>
                
                ${progressHtml}
                ${otpSection}
                
            </div>
            
            <div style="background-color: #0f172a; padding: 25px; text-align: center;">
                <p style="margin: 0; font-size: 14px; font-weight: 800; color: #1bb2e8; text-transform: uppercase; letter-spacing: 2px;">Secured by Zenvy Blockchain</p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #94a3b8; font-weight: 600;">&copy; 2026 Zenvy Logistics. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: '"Zenvy Logistics" <zenvy.services@gmail.com>',
            to: customer.email,
            subject: `📦 Zenvy Update: ${steps[stepIndex]}`,
            html: html
        });
        console.log(`Milestone email sent to ${customer.email} (Step: ${steps[stepIndex]})`);
    } catch (err) {
        console.error("Failed to send milestone email:", err);
    }
};

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ _id: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();

        await Product.findOneAndUpdate(
            { id: newOrder.productId },
            { $inc: { stock: -newOrder.quantity } }
        );

        await User.findOneAndUpdate(
            { id: newOrder.customerId },
            { $inc: { walletBalance: -newOrder.price } }
        );

        await addBlock(
            "CUSTOMER_PAID", 
            `Customer paid ₹${newOrder.price} for ${newOrder.quantity}x ${newOrder.productName}. Funds locked.`, 
            newOrder.orderId
        );

        // Milestone 0: Ordered
        try {
            const customer = await User.findOne({ id: newOrder.customerId });
            await sendOrderEmail(customer, newOrder, 0);
        } catch (mailErr) {}

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { status, location, logisticsId, deliveryPersonId } = req.body;
        const orderId = req.params.id;

        const order = await Order.findOne({ orderId });
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = status;
        if (logisticsId) order.logisticsId = logisticsId;
        if (deliveryPersonId) order.deliveryPersonId = deliveryPersonId;

        order.history.push({ status, location, time: new Date() });
        await order.save();

        let action = 'STATUS_UPDATED';
        const customer = await User.findOne({ id: order.customerId });
        
        // Forward Logistics
        if (status === 'Packed') {
            action = "ITEM_PACKED";
            await sendOrderEmail(customer, order, 1); // Milestone 1: Packed
        } 
        else if (status === 'Picked Up') {
            action = "ITEM_PICKED_UP";
            await sendOrderEmail(customer, order, 2); // Milestone 2: Shipped
        } 
        else if (status === 'In Transit') {
            action = "IN_TRANSIT";
        } 
        else if (status === 'Out for Delivery') {
            action = "OUT_FOR_DELIVERY";
            const ledger = await getLedger();
            const initialBlock = ledger.find(b => b.data.relatedId === orderId);
            const otp = initialBlock ? initialBlock.hash.slice(-6).toUpperCase() : null;
            await sendOrderEmail(customer, order, 3, otp); // Milestone 3: Out for Delivery (with OTP)
        } 
        else if (status === 'Delivered') {
            action = "DELIVERED";
            await sendOrderEmail(customer, order, 4); // Milestone 4: Delivered
            
            await User.findOneAndUpdate({ id: order.supplierId }, { $inc: { walletBalance: order.price } });
            setTimeout(async () => {
                order.status = 'Funds Released';
                order.history.push({ status: 'Funds Released', location: "Supplier Account", time: new Date() });
                await order.save();
                await addBlock("PAYMENT_RELEASED", `Payment of ₹${order.price} released to Supplier`, orderId);
            }, 1500);
        }
        // REVERSE LOGISTICS (NEW)
        else if (status === 'Return Requested') action = "RETURN_INITIATED";
        else if (status === 'Return Picked Up') action = "RETURN_PICKED_UP";
        else if (status === 'Return in Transit') action = "RETURN_IN_TRANSIT";
        else if (status === 'Refunded') {
            action = "REFUND_ISSUED";
            // 1. Take money back from Supplier
            await User.findOneAndUpdate({ id: order.supplierId }, { $inc: { walletBalance: -order.price } });
            // 2. Give money back to Customer
            await User.findOneAndUpdate({ id: order.customerId }, { $inc: { walletBalance: order.price } });
            // 3. Give inventory back to Supplier
            await Product.findOneAndUpdate({ id: order.productId }, { $inc: { stock: order.quantity } });
        }

        await addBlock(action, `Order Status updated to: ${status}`, orderId, location);
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;