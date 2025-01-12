import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get('/', (req,res) => {
    res.send('Minyma World');
})

// Middleware to parse JSON data
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Middleware to allow cross-origin requests
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port :- ${PORT}` );
    connectDB();
    
})