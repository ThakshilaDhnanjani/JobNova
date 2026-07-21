const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB connection failed; continuing in demo mode.", err.message);
    }
};

module.exports = connectDB;