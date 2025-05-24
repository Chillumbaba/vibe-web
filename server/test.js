require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB!');
        
        const admin = mongoose.connection.db.admin();
        const serverInfo = await admin.serverInfo();
        console.log('MongoDB server version:', serverInfo.version);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

testConnection(); 