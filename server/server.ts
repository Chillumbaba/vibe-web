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
  const clientBuildPath = path.join(process.cwd(), 'vibe-web/client/build');
  console.log('Looking for client build at:', clientBuildPath);
  
  // Check if the build directory exists
  if (fs.existsSync(clientBuildPath)) {
    console.log('Client build directory found');
    app.use(express.static(clientBuildPath));
    
    // Serve index.html for all non-API routes
    app.get('*', (req: Request, res: Response) => {
      if (!req.path.startsWith('/api')) {
        const indexPath = path.join(clientBuildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error('index.html not found in build directory');
          res.status(404).send('Frontend not found');
        }
      }
    });
  } else {
    console.error('Client build directory not found at:', clientBuildPath);
    // List parent directory contents for debugging
    try {
      const parentDir = path.dirname(clientBuildPath);
      console.log('Contents of', parentDir + ':');
      const files = fs.readdirSync(parentDir);
      console.log(files);
    } catch (error) {
      console.error('Error listing parent directory:', error);
    }
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 