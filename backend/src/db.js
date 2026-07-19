const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/zenvy');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    email: { type: String, required: false }, // 👈 FIXED: Made optional so old supplier/mfg accounts don't crash on save
    name: String,
    role: String,
    walletBalance: { type: Number, default: 0 },
    assignedLogistics: String
});

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    baseId: String,
    name: String,
    wholesale: Number,
    retail: Number,
    mrp: Number,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    owner: String,
    creatorId: String,
    stock: Number,
    image: String,
    category: [String],
    authorizedSuppliers: [String]
});

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customerId: String,
    supplierId: String,
    productId: String,
    productName: String,
    quantity: Number,
    unitPrice: Number,
    price: Number,
    status: String,
    logisticsId: String, 
    deliveryPersonId: String,
    history: [{ status: String, location: String, time: Date }]
});

module.exports = {
    connectDB,
    User: mongoose.model('User', UserSchema),
    Product: mongoose.model('Product', ProductSchema),
    Order: mongoose.model('Order', OrderSchema)
};