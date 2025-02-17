// Import the cloudinary module
import cloudinary from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary with your Cloudinary account credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Replace with your cloud name
    api_key: process.env.CLOUDINARY_API_KEY,        // Replace with your API key
    api_secret: process.env.CLOUDINARY_API_SECRET   // Replace with your API secret
});

// Function to upload file to Cloudinary
const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'hive',
            resource_type: 'raw'  // Specify the folder in Cloudinary
        });
        console.log(result, 'result');
        return result;
    } catch (error) {
        console.log(error);
    }
};

// Example: Upload a local file (change the path as needed)

export default uploadFile
