import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Log configuration for debugging
console.log('Cloudinary Environment:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    node_env: process.env.NODE_ENV
});

try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Test the configuration
    const testResult = await cloudinary.api.ping();
    console.log('Cloudinary connection successful');
} catch (error) {
    console.error('Cloudinary configuration error:', error);
}

export default cloudinary;