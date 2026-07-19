const express = require('express');
const router = express.Router();
const { Product, User } = require('../db');
const { addBlock } = require('./blockchain');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        await addBlock("PRODUCT_MINTED", `Manufacturer listed ${newProduct.stock} units of ${newProduct.name}`, newProduct.baseId, "Main Factory");
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update Authorized Suppliers
router.put('/:id/authorize', async (req, res) => {
    try {
        const { authorizedSuppliers } = req.body;
        const product = await Product.findOneAndUpdate(
            { id: req.params.id }, 
            { authorizedSuppliers },
            { new: true }
        );
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Procure Inventory (Supplier buys from Manufacturer)
router.post('/procure', async (req, res) => {
    try {
        const { mfgProductId, supplierId, quantity } = req.body;
        
        const mfgProduct = await Product.findOne({ id: mfgProductId });
        const supplier = await User.findOne({ id: supplierId });

        if (!mfgProduct || !supplier) return res.status(404).json({ error: 'Product or Supplier not found' });
        if (mfgProduct.stock < quantity) return res.status(400).json({ error: 'Not enough stock available' });

        const totalCost = mfgProduct.wholesale * quantity;
        if (supplier.walletBalance < totalCost) return res.status(400).json({ error: 'Insufficient wallet balance' });

        // 1. Deduct stock from Manufacturer
        mfgProduct.stock -= quantity;
        await mfgProduct.save();

        // 2. Transfer the Money
        supplier.walletBalance -= totalCost;
        await supplier.save();
        await User.findOneAndUpdate({ id: mfgProduct.creatorId }, { $inc: { walletBalance: totalCost } });

        // 3. Add to Supplier's Inventory
        const supProdId = `${mfgProduct.baseId}-${supplierId}`;
        let supProduct = await Product.findOne({ id: supProdId });
        
        if (supProduct) {
            supProduct.stock += quantity; // Add to existing stock
            await supProduct.save();
        } else {
            // Create a fresh clone for the supplier
            const prodData = mfgProduct.toObject();
            delete prodData._id;
            
            supProduct = new Product({
                ...prodData,
                id: supProdId,
                owner: supplierId,
                stock: quantity,
                authorizedSuppliers: []
            });
            await supProduct.save();
        }

        // 4. Log to Blockchain
        await addBlock("SUPPLIER_PROCUREMENT", `Supplier ${supplierId} procured ${quantity} units of ${mfgProduct.name} for ₹${totalCost}`, mfgProduct.baseId);

        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 👇 NEW: Edit Product Name and Retail Price 👇
router.put('/:id', async (req, res) => {
    try {
        const { name, retail } = req.body;
        
        // Find the specific product the supplier wants to edit
        const product = await Product.findOne({ id: req.params.id });
        if (!product) return res.status(404).json({ error: "Product not found" });

        // Update MongoDB with the new details
        product.name = name;
        product.retail = retail;
        await product.save();

        // Log the change immutably to the Blockchain!
        await addBlock("PRODUCT_UPDATED", `Supplier updated display name to "${name}" and price to ₹${retail}`, product.id);

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;