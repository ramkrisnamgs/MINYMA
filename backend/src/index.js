import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Middleware to parse JSON data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Middleware to parse cookies
app.use(cookieParser());
// Middleware to allow cross-origin requests
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? process.env.FRONTEND_URL || "https://minyma.onrender.com"
        : "http://localhost:5173",
    credentials: true
}));

// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

server.listen(PORT, () => {
    console.log(`Server is running on port :- ${PORT}` );
    connectDB();
    
})


// what should be my commit message for socket implementation? => 