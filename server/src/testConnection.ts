import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(uri);
        console.log('Successfully connected to MongoDB!');
        
        // Test the connection by trying to get server info
        const admin = mongoose.connection.db.admin();
        const serverInfo = await admin.serverInfo();
        console.log('MongoDB server version:', serverInfo.version);
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testConnection(); 