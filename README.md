# Blog Application (task2)

A full-stack blog application with user authentication, role-based access control, and blog management features.

## Project Structure

The project is organized into two main directories:

- `frontend/`: React application built with Vite
- `server/`: Node.js backend server

## Features

- User authentication (login/signup)
- Role-based access control
- Blog post creation and management
- User management
- Responsive design with Tailwind CSS
- File upload support for blog images

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- ESLint
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/Parthh191/task2.git
cd task2
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd ../server
npm install
```

4. Set up environment variables
- Create `.env` file in the server directory
- Add necessary environment variables (MYSQL URI, JWT secret, etc.)

### Running the Application

1. Start the Backend Server
```bash
cd server
npm start
```

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The application should now be running on:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Directory Structure

### Frontend
- `/src/components`: Reusable React components
- `/src/pages`: Page components
- `/src/context`: React context providers
- `/src/utils`: Utility functions
- `/src/routes`: Route configurations

### Backend
- `/config`: Configuration files
- `/middleware`: Express middleware
- `/models`: Mongoose models
- `/uploads`: File upload storage

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

