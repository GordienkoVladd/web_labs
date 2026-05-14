const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB підключено');
    } catch (err) {
        console.error('❌ Помилка підключення:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;