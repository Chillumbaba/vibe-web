import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
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

// Determine the client build path based on the environment
const isProduction = process.env.NODE_ENV === 'production';
console.log('Environment:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

let clientBuildPath;
if (isProduction) {
  // In production (Render), the client build will be in the dist directory
  clientBuildPath = path.resolve(__dirname, '../client/build');
} else {
  // In development, use the path relative to the server directory
  clientBuildPath = path.resolve(__dirname, '../../vibe-web/client/build');
}

console.log('Client build path:', clientBuildPath);

// Serve static files from the React app
app.use(express.static(clientBuildPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  console.log('Trying to serve index.html from:', indexPath);
  
  try {
    if (!require('fs').existsSync(indexPath)) {
      console.error('index.html not found at:', indexPath);
      // List the contents of the parent directory to help debug
      const parentDir = path.dirname(indexPath);
      console.log('Contents of', parentDir + ':');
      const files = require('fs').readdirSync(parentDir);
      console.log(files);
      return res.status(404).send('Frontend build not found');
    }
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Error serving frontend');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 