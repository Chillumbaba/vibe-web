# A New Beginning

A simple web application that allows users to save text entries to a MongoDB database. Built with React (frontend) and Node.js/Express (backend).

## Project Structure

This is a monorepo containing:
- `packages/frontend`: React frontend application
- `packages/backend`: Node.js/Express backend application

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB Atlas account

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup MongoDB Atlas:
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Create a `.env` file in `packages/backend` with:
     ```
     PORT=3001
     MONGODB_URI=your_mongodb_atlas_uri_here
     ```

4. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm start
   
   # Or start them separately:
   npm run start:frontend
   npm run start:backend
   ```

## Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:3001

## Deployment

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables:
   - `PORT`
   - `MONGODB_URI`

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Axios
  - CSS3

- Backend:
  - Node.js
  - Express
  - MongoDB/Mongoose
  - TypeScript
  - CORS 