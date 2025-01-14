import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(config);

// Test the connection
try {
  const testResult = await cloudinary.api.ping();
  console.log('Cloudinary connection test successful:', testResult);
} catch (error) {
  console.error('Cloudinary connection test failed:', error);
  throw error;
}

export default cloudinary;