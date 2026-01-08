# 📦 lenses

![React](https://img.shields.io/static/v1?label=Framework&message=React&color=61DAFB&style=flat-square)
![Node.js](https://img.shields.io/static/v1?label=Runtime&message=Node.js&color=8CC84B&style=flat-square)
![MongoDB](https://img.shields.io/static/v1?label=Database&message=MongoDB&color=47A248&style=flat-square)
![Express](https://img.shields.io/static/v1?label=Server&message=Express&color=000000&style=flat-square)

## Project Overview
Lenses is a full-stack web application designed for real-time communication in a chat environment. Utilizing React for the frontend and Express for the backend, it provides a seamless user experience with features geared towards efficient management of chats and user interactions.

The architecture is split into two primary components:
- **Frontend**: Built with React, it leverages Chakra UI for responsive design and includes reusable components for user authentication and chat interfaces.
- **Backend**: Developed using Node.js and Express, the server handles API requests, manages database interactions with MongoDB, and enables real-time functionality through WebSockets (Socket.IO).

## 🌟 Features
- **Real-Time Messaging**: Users can send and receive messages instantly using Socket.IO, enhancing communication efficiency.
- **User Authentication**: Secure login and signup processes managed by JWT tokens to ensure authenticated sessions.
- **Dynamic Chat Interface**: Interactive chat components that update in real time as messages are sent or received.
- **Customizable Themes**: Utilizes Chakra UI's theming capabilities allowing for an aesthetically pleasing user interface.
- **Fully Responsive Design**: The application layout adapts to different screen sizes, providing an optimal experience on both mobile and desktop devices.

## Core Sections

### API Endpoints
| Method | Endpoint              | Description                        |
|--------|----------------------|------------------------------------|
| POST   | `/api/users/register`| Register a new user               |
| POST   | `/api/users/login`   | Authenticate a user               |
| GET    | `/api/messages/:chatId`  | Retrieve messages in a specific chat |
| POST   | `/api/messages/`     | Send a new message                |

### Installation
To install dependencies, execute the following commands:

1. For server dependencies:
   ```bash
   npm install
   ```

2. For frontend dependencies (in `frontend` directory):
   ```bash
   cd frontend
   npm install
   ```

### Usage
To start the server:
```bash
npm start # From the root directory 
```
To run the frontend application:
```bash
cd frontend  
npm start 
```
The app will be available at `http://localhost:3000`, while API requests will proxy to `http://localhost:5000`.

### Project Structure Overview

```
/
├── .env                   # Environment variables file 
├── .gitignore             # Git ignore rules 
├── frontend/              # Frontend application files 
│   ├── src/               # Source files for React components  
│       └── ...
└── server/                # Backend application files  
    ├── config/            # Configuration files  
    ├── controllers/       # Logic to handle incoming requests  
    ├── routes/            # API route definitions  
    └── ...
```

### Database Schema
The primary database structure involves collections such as Users, Messages, and Chats enabling organized storage of user data and conversations.

## Development and Deployment
Developers can set up their development environments by cloning this repository. Ensure that MongoDB is running locally or configure your connection string in the `.env` file.

Basic environment variables include:
```
MONGODB_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret>
```

Deployment instructions will depend on your preferred platform but generally involve setting up the backend server with Node.js hosting solutions (like Heroku) alongside configuring environmental variables appropriately.

## License Information
This project does not currently have a license specified. Consider adding one if you plan to share or distribute your work.

## Version Information
Version: 1  
Last updated: 2025-03-25T05:59:07.334Z

## Release Notes
- New features added in this version include enhanced real-time messaging capability using Socket.IO.
- Improvements made to existing functionality include better error handling during authentication processes.
- These changes were released on 2025-03-25T05:59:07.334Z.