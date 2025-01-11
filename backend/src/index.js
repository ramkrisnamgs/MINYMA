import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
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

// Routes Middleware
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port :- ${PORT}` );
    connectDB();
    
})