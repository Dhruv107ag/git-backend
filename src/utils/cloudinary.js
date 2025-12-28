import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ config top-level pe
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ function top-level pe
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file upload ho gayi → local delete
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // error aya → local delete
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
