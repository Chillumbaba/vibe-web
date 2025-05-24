# Vibe Web Application

A full-stack web application built with React (frontend) and Node.js/Express (backend) that helps users track and manage their daily activities and goals.

## Features

- User authentication and authorization
- Daily activity tracking
- Progress visualization
- MongoDB Atlas integration for data persistence
- RESTful API endpoints
- Modern, responsive UI

## Tech Stack

### Frontend
- React
- TypeScript
- Modern CSS

### Backend
- Node.js
- Express
- MongoDB Atlas
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js v14 or higher
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/krishnan.paddy/vibe-web.git
cd vibe-web
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the application
```bash
# Start backend server
cd server
npm start

# Start frontend (in a new terminal)
cd client
npm start
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- More endpoints coming soon...

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/) 