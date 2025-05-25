import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { userRouter } from './src/routes/userRoutes';
import { habitRouter } from './src/routes/habitRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// API Routes
app.use('/api/users', userRouter);
app.use('/api/habits', habitRouter);

// Debug information
console.log('Environment:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// In production, serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  // Look for static files in the dist/public directory (one level up from server build output)
  const publicPath = path.join(__dirname, '..', 'public');
  console.log('Looking for static files in:', publicPath);

  if (fs.existsSync(publicPath)) {
    console.log('Static files directory found');
    try {
      const files = fs.readdirSync(publicPath);
      console.log('Contents of public directory:', files);

      // Serve static files
      app.use(express.static(publicPath));

      // Serve index.html for all non-API routes
      app.get('*', (req: Request, res: Response) => {
        if (!req.path.startsWith('/api')) {
          const indexPath = path.join(publicPath, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
          } else {
            console.error('index.html not found');
            res.status(404).send('Frontend not found');
          }
        }
      });
    } catch (error) {
      console.error('Error serving static files:', error);
      throw error;
    }
  } else {
    console.error('Static files directory not found at:', publicPath);
    app.get('*', (req: Request, res: Response) => {
      if (!req.path.startsWith('/api')) {
        res.status(404).send('Frontend not found');
      }
    });
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 