const express = require('express');
const router = express.Router();
const { User } = require('../db');

router.post('/login', async (req, res) => {
    const { id, pass } = req.body;
    const user = await User.findOne({ id, pass });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(user);
});

router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        if(newUser.role === 'manufacturer') newUser.walletBalance = 500000;
        if(newUser.role === 'supplier') newUser.walletBalance = 100000;
        if(newUser.role === 'customer') newUser.walletBalance = 50000;
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        console.error("MONGODB REGISTRATION ERROR:", err);
        res.status(400).json({ error: 'User ID exists or invalid data' });
    }
});

// NEW: Get all users (so we can populate our dropdown lists)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-pass'); // Don't send passwords to frontend!
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NEW: Assign Logistics to a Supplier
router.put('/logistics', async (req, res) => {
    try {
        const { supplierId, logisticsId } = req.body;
        const user = await User.findOneAndUpdate(
            { id: supplierId }, 
            { assignedLogistics: logisticsId }, 
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;