const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

// Import routers
const authRoutes = require('./modules/auth');
const productRoutes = require('./modules/product'); 
const orderRoutes = require('./modules/order');
const { getLedger } = require('./modules/blockchain');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/ledger', async (req, res) => {
    const ledger = await getLedger();
    res.json(ledger);
});

module.exports = app;