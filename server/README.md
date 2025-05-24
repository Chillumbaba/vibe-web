# Vibe Web Server

Backend server for the Vibe Web application, a habit tracking system with user authentication.

## Features

- User authentication (register, login)
- Habit tracking with customizable rules
- Daily entries management
- Statistics calculation
- MongoDB database storage
- TypeScript support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vibe-web
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. Start MongoDB service (if using local installation)

## Development

Run the development server:
```bash
npm run dev
```

## Production

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile (requires authentication)

### Habits
- GET `/api/habits` - Get user's habit data
- POST `/api/habits/rules` - Create or update rules
- POST `/api/habits/entries` - Add or update daily entry
- GET `/api/habits/stats` - Get statistics for a time period

## License

ISC 