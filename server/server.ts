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

// Serve static files from the React app
const clientBuildPath = path.resolve(__dirname, '../../vibe-web/client/build');
app.use(express.static(clientBuildPath));
console.log('Serving static files from:', clientBuildPath);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  console.log('Trying to serve index.html from:', indexPath);
  if (!require('fs').existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath);
    return res.status(404).send('Frontend build not found');
  }
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 