import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { envConfig } from "../../presentation/express/configs/env.config";

dotenv.config();

export const cloudinaryConfig = {
  cloudName: envConfig.CLOUDINARY_CLOUD_NAME,
  apiKey: envConfig.CLOUDINARY_API_KEY,
  apiSecret: envConfig.CLOUDINARY_API_SECRET,
  folder: envConfig.CLOUDINARY_BASE_FOLDER || "byway",
};

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
  secure: true,
});

export { cloudinary };

