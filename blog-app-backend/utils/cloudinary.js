const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_KEY,     //  Cloudinary API key
  api_secret: process.env.CLOUDINARY_SECRET, //  Cloudinary API secret
});

// Export the configured Cloudinary instance for use in other files
module.exports = cloudinary;
