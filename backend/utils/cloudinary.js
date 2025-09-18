// utils/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Export a reusable upload function
// export const uploadToCloudinary = async (file) => {
//   const fileUri = getDataUri(file);
//   const result = await cloudinary.uploader.upload(fileUri);
//   return result.secure_url;
// };

export default cloudinary ;
