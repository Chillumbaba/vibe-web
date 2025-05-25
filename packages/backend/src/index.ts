import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_uri_here';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define Text schema
const textSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Text = mongoose.model('Text', textSchema);

// API endpoint
app.post('/api/save', async (req, res) => {
  try {
    const { text } = req.body;
    const newText = new Text({ text });
    await newText.save();
    res.status(201).json({ message: 'Text saved successfully', data: newText });
  } catch (error) {
    console.error('Error saving text:', error);
    res.status(500).json({ message: 'Error saving text' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 